# UserService (Node.js)

This service provides APIs for user management, authentication, user profiles, addresses, and payment methods, similar to the original Java Spring Boot service. It uses Express, Sequelize, and PostgreSQL.

## Endpoints
- `POST /api/auth/register` — Đăng ký người dùng
- `POST /api/auth/login` — Đăng nhập
- `GET /api/users` — Danh sách người dùng (admin)
- `GET /api/users/profile` — Thông tin cá nhân
- `PUT /api/users/profile` — Cập nhật thông tin cá nhân
- `GET /api/users/addresses` — Danh sách địa chỉ giao hàng
- `POST /api/users/addresses` — Thêm địa chỉ giao hàng
- `PUT /api/users/addresses/:id` — Cập nhật địa chỉ
- `DELETE /api/users/addresses/:id` — Xóa địa chỉ
- `GET /api/users/payment-methods` — Danh sách phương thức thanh toán
- `POST /api/users/payment-methods` — Thêm phương thức thanh toán
- `PUT /api/users/payment-methods/:id` — Cập nhật phương thức thanh toán
- `DELETE /api/users/payment-methods/:id` — Xóa phương thức thanh toán

## Development
- Cấu hình DB trong `.env`
- Chạy migration: `npx sequelize-cli db:migrate`
- Chạy seed: `npx sequelize-cli db:seed:all`
- Khởi động: `node index.js` hoặc `npm start`
