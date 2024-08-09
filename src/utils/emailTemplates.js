export const getPasswordResetEmail = passwordResetUrl => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body
    style="
      margin: 0;
      background-color: #f4f4f4;
      padding: 15px;
      font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
    "
  >
    <div
      style="
        width: 100%;
        max-width: 640px;
        background-color: #ffffff;
        padding: 25px;
        margin: auto;
        box-sizing: border-box;
      "
    >
      <div style="text-align: center">
        <img
          src="https://res.cloudinary.com/dlqnx5pot/image/upload/v1723141332/shopease-logo_qj2gip.png"
          alt="shopease-logo"
          style="width: 200px"
        />
      </div>

      <div style="margin-top: 25px; text-align: center">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #6366f1">
          Reset Your Password
        </h2>

        <p style="margin: 0; margin-top: 20px; font-size: 15px">
          We have received a request to reset your password. Please click the button below to create
          a new password.
        </p>

        <a
          style="
            display: inline-block;
            padding: 12px 25px;
            margin-top: 25px;
            background-color: #6366f1;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-size: 15px;
            font-weight: 500;
          "
          href=${passwordResetUrl}
          >Reset Password</a
        >

        <p style="margin: 0; margin-top: 20px; font-size: 15px">
          If you did not request a password reset, please ignore this email.
        </p>
      </div>

      <div style="margin-top: 40px; text-align: center; color: #999; font-size: 12px">
        <p style="margin: 0">&copy; 2024 Shopease. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;

export const getOrderConfirmationEmail = order => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body
    style="
      margin: 0;
      padding: 15px;
      background-color: #f4f4f4;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    "
  >
    <div
      style="
        width: 100%;
        max-width: 640px;
        background-color: #ffffff;
        padding: 25px;
        margin: auto;
        box-sizing: border-box;
      "
    >
      <div style="text-align: center">
        <img
          src="https://res.cloudinary.com/dlqnx5pot/image/upload/v1723141332/shopease-logo_qj2gip.png"
          alt="shopease-logo"
          style="width: 200px"
        />
      </div>

      <div style="margin-top: 25px">
        <div style="background-color: #6366f1; padding: 15px; border-radius: 12px 12px 0 0">
          <h1
            style="margin: 0; font-size: 22px; font-weight: 500; color: #ffffff; text-align: center"
          >
            Order Confirmation
          </h1>
        </div>

        <div style="margin-top: 20px">
          <h2 style="margin: 0; font-size: 20px; font-weight: 500">Hello, Shubham Purwar</h2>
          <p style="margin: 0; margin-top: 10px; font-size: 15px">
            Thank you for your order! We're excited to let you know that your order has been
            received and is being processed. Below are the details of your order:
          </p>
        </div>

        <div style="margin-top: 20px">
          <h3 style="margin: 0; font-size: 18px; font-weight: 500">
            Order number: order_HKzW6C0cFJd5FP
          </h3>
          <p style="margin: 0; margin-top: 10px; font-size: 15px">Placed on August 8, 2024</p>

          <table style="margin-top: 15px; width: 100%; border-collapse: collapse; font-size: 15px">
            <tr>
              <th
                style="
                  width: 40%;
                  border: 1px solid #ddd;
                  text-align: left;
                  font-weight: 500;
                  padding: 9px 12px;
                "
              >
                Item
              </th>
              <th
                style="
                  width: 30%;
                  border: 1px solid #ddd;
                  text-align: left;
                  font-weight: 500;
                  padding: 9px 12px;
                "
              >
                Quantity
              </th>
              <th
                style="
                  width: 30%;
                  border: 1px solid #ddd;
                  text-align: left;
                  font-weight: 500;
                  padding: 9px 12px;
                "
              >
                Price
              </th>
            </tr>

            <tr>
              <td style="width: 40%; border: 1px solid #ddd; padding: 9px 12px">Adidas Shoes</td>
              <td style="width: 30%; border: 1px solid #ddd; padding: 9px 12px">5</td>
              <td style="width: 30%; border: 1px solid #ddd; padding: 9px 12px">₹900</td>
            </tr>
          </table>

          <div style="margin-top: 20px; font-size: 15px">
            <p style="margin: 0"><strong style="font-weight: 500">Total Amount: </strong>₹4500</p>
            <p style="margin: 0; margin-top: 10px">
              <strong style="font-weight: 500">Shipping Address: </strong>Zerodha Head Office, JP
              Nagar, Bangalore, Karnataka, India 208901
            </p>
          </div>
        </div>

        <div style="margin-top: 20px; font-size: 15px">
          <p style="margin: 0">
            We will send you another email once your order has shipped. If you have any questions,
            feel free to reply to this email.
          </p>
          <p style="margin: 0; margin-top: 10px">Thank you for shopping with us!</p>
        </div>
      </div>

      <div style="margin-top: 40px; text-align: center; color: #999; font-size: 12px">
        <p style="margin: 0">&copy; Shopease. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
