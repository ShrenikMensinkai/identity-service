import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants/roles.constant';
import { Role } from '../constants/roles.constant';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

