import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, RoleName } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService implements OnModuleInit {
  private readonly logger = new Logger()
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    onModuleInit() {
        this.seedDefaultRoles();
        this.logger.log("seed roles successful")
    }

    async seedDefaultRoles(): Promise<void> {
        const roles: { name: RoleName; description: string }[] = [
            {
                name: RoleName.THU_KHO,
                description: 'Thủ kho – quản lý nhập xuất kho',
            },
            {
                name: RoleName.KE_TOAN,
                description: 'Kế toán – theo dõi chứng từ và số liệu',
            },
            {
                name: RoleName.QUAN_LY,
                description: 'Quản lý – toàn quyền hệ thống',
            },
        ];

        for (const roleData of roles) {
            const exists = await this.roleRepository.findOne({
                where: { name: roleData.name },
            });

            if (!exists) {
                const role = this.roleRepository.create(roleData);
                await this.roleRepository.save(role);
            }
        }
    }
}
