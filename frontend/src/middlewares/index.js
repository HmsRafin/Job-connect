import RoleMiddleware from './RoleMiddleware';
import AuthMiddleware from './AuthMiddleware';
import GuestMiddleware from './GuestMiddleware';

export {
  RoleMiddleware,
  AuthMiddleware,
  GuestMiddleware,
  RoleMiddleware as ProtectedRoute, // Alias for convenient drop-in usage
};

export default RoleMiddleware;
