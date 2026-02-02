import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserStatus } from './entities/user.entity';
import { Role, RoleName } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';

@Injectable()
export class UsersService implements OnModuleInit {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,

        private readonly auditLogsService: AuditLogsService,
    ) {}

    async onModuleInit() {
        await this.seedQuanLy();
    }

    private async seedQuanLy() {
        // 1. Tìm role QUAN_LY
        let roleQuanLy = await this.roleRepository.findOne({
            where: { name: RoleName.QUAN_LY },
        });

        if (!roleQuanLy) {
            roleQuanLy = this.roleRepository.create({
                name: RoleName.QUAN_LY,
                description: 'Quản lý hệ thống',
            });
            await this.roleRepository.save(roleQuanLy);
        }

        // 2. Kiểm tra đã có user QUAN_LY chưa
        const existedQuanLy = await this.userRepository
            .createQueryBuilder('user')
            .leftJoin('user.roles', 'role')
            .where('role.name = :role', { role: RoleName.QUAN_LY })
            .getOne();

        if (existedQuanLy) {
            this.logger.log('Seed QUẢN_LÝ: đã tồn tại, bỏ qua');
            return;
        }

        // 3. Hash mật khẩu
        const passwordHash = await bcrypt.hash('123456', 10);

        // 4. Tạo user QUẢN_LÝ
        const quanLyUser = this.userRepository.create({
            user_name: 'quanly',
            full_name: 'Quản lý hệ thống',
            email: 'quanly@company.com',
            password_hash: passwordHash,
            status: UserStatus.ACTIVE,
            roles: [roleQuanLy],
        });

        await this.userRepository.save(quanLyUser);

        this.logger.log('✅ Seed tài khoản QUẢN_LÝ thành công');
    }

    // ================= CREATE =================
    async create(dto: CreateUserDto, currentUser: User) {
        // 1. Check trùng user
        const existedUser = await this.userRepository.findOne({
            where: [{ email: dto.email }, { user_name: dto.user_name }],
        });

        if (existedUser) {
            throw new BadRequestException('User already exists');
        }

        // 2. Check quyền tạo QUAN_LY
        const isCurrentUserQuanLy = this.hasRole(currentUser, RoleName.QUAN_LY);
        const isCreatingQuanLy = dto.roles?.includes(RoleName.QUAN_LY);

        if (isCurrentUserQuanLy && isCreatingQuanLy) {
            throw new ForbiddenException('QUẢN_LÝ không được tạo thêm tài khoản QUẢN_LÝ');
        }

        // 3. Lấy roles + validate
        const roles = await this.roleRepository.findBy({
            name: In(dto.roles as any),
        });

        if (!roles || roles.length === 0) {
            throw new BadRequestException('Roles not found');
        }

        // 4. Hash password
        const passwordHash = await bcrypt.hash(dto.password, 10);

        // 5. Tạo user entity
        const user = this.userRepository.create({
            user_name: dto.user_name,
            email: dto.email,
            full_name: dto.full_name,
            password_hash: passwordHash,
            status: dto.status ?? UserStatus.ACTIVE,
            roles,
        });

        // 6. Save user
        await this.userRepository.save(user);

        // 7. Ghi audit log
        await this.auditLogsService.create({
            userId: currentUser.id,
            action: AuditAction.CREATE,
            entityName: 'User',
            entityId: user.id,
            newValue: {
                email: user.email,
                roles: roles.map((r) => r.name),
            },
        });

        // 8. Query lại user kèm roles (QUAN TRỌNG)
        return this.userRepository.findOne({
            where: { id: user.id },
            relations: ['roles'],
        });
    }

    hasRole(user: User, role: RoleName) {
        return user.roles?.some((r) => r.name === role);
    }

    // ================= READ =================
    async findAll() {
        return this.userRepository.find({
            relations: ['roles'],
        });
    }

    async findOne(id: string) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['roles'],
        });

        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    // ================= UPDATE =================
    async update(id: string, dto: UpdateUserDto, currentUser: User) {
        const user = await this.findOne(id);

        if (!user) {
            throw new NotFoundException('User không tồn tại');
        }

        const isTargetQuanLy = user.roles.some((r) => r.name === RoleName.QUAN_LY);

        const isTryingChangeRoles = dto.roles !== undefined;

        // 🔒 CHẶN UPDATE ROLE QUẢN_LÝ
        if (isTargetQuanLy && isTryingChangeRoles) {
            throw new ForbiddenException('Không được phép thay đổi role của QUẢN_LÝ');
        }

        // 🔒 CHẶN GÁN THÊM ROLE QUẢN_LÝ
        if (isTryingChangeRoles && dto.roles?.includes(RoleName.QUAN_LY)) {
            throw new ForbiddenException('Không được phép gán role QUẢN_LÝ');
        }
        const oldValue = { ...user };

        if (dto.password) {
            user.password_hash = await bcrypt.hash(dto.password, 10);
        }

        if (dto.roles) {
            user.roles = await this.roleRepository.findBy({
                name: In(dto.roles as any),
            });
        }

        Object.assign(user, {
            user_name: dto.user_name ?? user.user_name,
            email: dto.email ?? user.email,
            full_name: dto.full_name ?? user.full_name,
            status: dto.status ?? user.status,
        });

        await this.userRepository.save(user);

        await this.auditLogsService.create({
            userId: currentUser.id,
            action: AuditAction.UPDATE,
            entityName: 'User',
            entityId: user.id,
            oldValue,
            newValue: {
                email: user.email,
                status: user.status,
                roles: user.roles.map((r) => r.name),
            },
        });

        return user;
    }

    // ================= DELETE =================
    async remove(id: string, currentUser: User) {
        const user = await this.findOne(id);

        const isTargetQuanLy = user.roles.some((r) => r.name === RoleName.QUAN_LY);

        if (isTargetQuanLy) {
            throw new ForbiddenException('Không được phép xóa tài khoản QUẢN_LÝ');
        }

        await this.userRepository.softDelete(id);

        await this.auditLogsService.create({
            userId: currentUser.id,
            action: AuditAction.DELETE,
            entityName: 'User',
            entityId: id,
            oldValue: {
                email: user.email,
                roles: user.roles.map((r) => r.name),
            },
        });

        return { message: 'User deleted' };
    }
}
