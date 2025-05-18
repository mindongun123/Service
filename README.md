# OrderService (Node.js, MongoDB, Kafka)

OrderService là microservice quản lý đơn hàng và giỏ hàng cho hệ thống thương mại điện tử, xây dựng bằng Node.js, MongoDB (Mongoose) và Kafka.

## Tính năng chính
- Quản lý giỏ hàng: thêm, sửa, xóa sản phẩm trong giỏ hàng
- Quản lý đơn hàng: tạo đơn, xem danh sách, xem chi tiết, cập nhật trạng thái, hủy đơn
- Tích hợp Kafka để publish các sự kiện đơn hàng (ORDER_CREATED, ORDER_STATUS_UPDATED, ORDER_CANCELLED)
- Cấu trúc code rõ ràng, dễ mở rộng

## Công nghệ sử dụng
- Node.js + Express.js
- MongoDB với Mongoose
- Kafka (kafkajs)
- dotenv, uuid, body-parser, cors

## Cấu trúc thư mục
- `models/` - Định nghĩa schema cho MongoDB (Cart, Order)
- `routes/` - Định nghĩa các API endpoint (cart, orders)
- `services/` - Tích hợp Kafka, các service mở rộng
- `index.js` - Khởi tạo app, kết nối MongoDB, mount routes

## Cách chạy project
1. Cài đặt MongoDB và Kafka, đảm bảo các service này đang chạy
2. Cài đặt dependencies:
   ```
   npm install
   ```
3. Tạo file `.env` với các biến môi trường:
   ```
   PORT=5003
   MONGO_URI=mongodb://localhost:27017/orderservice
   KAFKA_BROKER=localhost:9092
   ```
4. Chạy service:
   ```
   node index.js
   ```

## API chính
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart/items` - Thêm/sửa sản phẩm trong giỏ
- `DELETE /api/cart/items/:productId` - Xóa sản phẩm khỏi giỏ
- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng
- `POST /api/orders/:id/cancel` - Hủy đơn hàng

> **Lưu ý:** Khi gọi API, cần truyền header `x-user-id` để xác định người dùng.

## Đóng góp & mở rộng
- Có thể mở rộng thêm các service khác, tích hợp Saga, Event Sourcing, Firebase notification...
- Đóng góp vui lòng tạo pull request hoặc issue.
