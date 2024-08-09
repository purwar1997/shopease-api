import { getDateString } from './helperFunctions.js';
import { BUSINESS_INFO } from '../constants/common.js';

const getCurrentYear = () => {
  const currentDate = new Date();
  return currentDate.getFullYear();
};

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
          src=${BUSINESS_INFO.LOGO_URL}
          alt="business-logo"
          style="width: 200px"
        />
      </div>

      <div style="margin-top: 25px; text-align: center">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #6366f1">
          Reset Your Password
        </h2>

        <p style="margin: 0; margin-top: 20px; font-size: 15px; line-height: 1.5">
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

        <p style="margin: 0; margin-top: 20px; font-size: 15px; line-height: 1.5">
          If you did not request a password reset, please ignore this email.
        </p>
      </div>

      <div style="margin-top: 40px; text-align: center; color: #888; font-size: 12px">
        <p style="margin: 0">&copy; ${getCurrentYear()} ${
  BUSINESS_INFO.NAME
}. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;

export const getOrderConfirmationEmail = (customerName, order) => {
  const { line1, line2, city, state, country, postalCode } = order.shippingAddress;

  const addressString = line2
    ? `${line1}, ${line2}, ${city} - ${postalCode}, ${state}, ${country}`
    : `${line1}, ${city} - ${postalCode}, ${state}, ${country}`;

  return `<!DOCTYPE html>
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
          src=${BUSINESS_INFO.LOGO_URL}
          alt="business-logo"
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

        <div style="margin-top: 25px">
          <h2 style="margin: 0; font-size: 20px; font-weight: 500">Hello, ${customerName}</h2>
          <p style="margin: 0; margin-top: 10px; font-size: 15px; line-height: 1.5">
            Thank you for your order! We're excited to let you know that your order has been
            received and is being processed. Below are the details of your order:
          </p>
        </div>

        <div style="margin-top: 20px">
          <h3 style="margin: 0; font-size: 18px; font-weight: 500">
            Order number: ${order._id}
          </h3>
          <p style="margin: 0; margin-top: 10px; font-size: 15px">Placed on ${getDateString(
            order.createdAt
          )}</p>

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
                Price (₹)
              </th>
            </tr>

            ${order.items
              .map(
                item => `<tr>
              <td style="width: 40%; border: 1px solid #ddd; padding: 9px 12px">${item.product.title}</td>
              <td style="width: 30%; border: 1px solid #ddd; padding: 9px 12px">${item.quantity}</td>
              <td style="width: 30%; border: 1px solid #ddd; padding: 9px 12px">${item.product.price}</td>
            </tr>`
              )
              .join('')}
          
          </table>

          <div style="margin-top: 20px; font-size: 15px">
            <p style="margin: 0; line-height: 1.5">
              <strong style="font-weight: 500">Total Amount: </strong>₹${order.totalAmount}
            </p>
            <p style="margin: 0; margin-top: 10px; line-height: 1.5">
              <strong style="font-weight: 500">Shipping Address: </strong>${addressString}
            </p>
          </div>
        </div>

        <div style="margin-top: 20px; font-size: 15px">
          <p style="margin: 0; line-height: 1.5">
            You order will be delivered on ${getDateString(
              order.estimatedDeliveryDate
            )}. If you have any questions, feel free to
            reply to this email.
          </p>

          <p style="margin: 0; margin-top: 10px; line-height: 1.5">
            Thank you for shopping with us!
          </p>
        </div>
      </div>

      <div style="margin-top: 40px; text-align: center; color: #888; font-size: 12px">
        <p style="margin: 0">&copy; ${getCurrentYear()} ${
    BUSINESS_INFO.NAME
  }. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
};

export const getOrderCancellationEmail = (customerName, order) => `<!DOCTYPE html>
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
          src=${BUSINESS_INFO.LOGO_URL}
          alt="business-logo"
          style="width: 200px"
        />
      </div>

      <div style="margin-top: 20px">
        <div style="padding-top: 25px; border-top: 1px solid #ddd; text-align: center">
          <h1 style="margin: 0; font-size: 22px; font-weight: 500; color: #4f4f4f">
            Order Cancellation Confirmation
          </h1>
        </div>

        <div style="margin-top: 20px; font-size: 15px">
          <p style="margin: 0">Dear ${customerName},</p>

          <p style="margin: 0; margin-top: 15px; line-height: 1.5">
            We wanted to let you know that your order #${order._id} has been successfully
            cancelled as per your request. The order amount of ₹${order.totalAmount} will be refunded to your bank
            account shortly.
          </p>

          <p style="margin: 0; margin-top: 15px; line-height: 1.5">
            If you have any questions or need any further assistance, our support team is here to
            help.
          </p>

          <p style="margin: 0; margin-top: 15px; line-height: 1.5">
            Thank you for choosing us. We hope to have the pleasure of serving you again in the
            future.
          </p>
        </div>

        <div
          style="
            margin-top: 25px;
            text-align: center;
            padding-top: 25px;
            border-top: 1px solid #ddd;
            font-size: 14px;
            color: #777;
          "
        >
          <p style="margin: 0">Best regards,</p>
          <p style="margin: 0; margin-top: 10px">Shopease</p>
          <p style="margin: 0; margin-top: 10px">
            <a style="text-decoration: none" href=${BUSINESS_INFO.WEBSITE_URL} target="_blank">Visit our website</a>
            <span style="padding: 7px; color: #848484; position: relative; bottom: 0.5px">|</span>
            <a style="text-decoration: none" href="mailto:${BUSINESS_INFO.CONTACT_EMAIL}">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
`;

export const getOrderDeletionEmail = (customerName, order) => `<!DOCTYPE html>
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
          src=${BUSINESS_INFO.LOGO_URL}
          alt="business-logo"
          style="width: 200px"
        />
      </div>

      <div style="margin-top: 20px">
        <div style="padding-top: 25px; border-top: 1px solid #ddd; text-align: center">
          <h1 style="margin: 0; font-size: 22px; font-weight: 500; color: #4f4f4f">
            Order Deletion Notification
          </h1>
        </div>

        <div style="margin-top: 20px; font-size: 15px">
          <p style="margin: 0">Dear ${customerName},</p>

          <p style="margin: 0; margin-top: 15px; line-height: 1.5">
            We regret to inform you that your order #${order._id} has been deleted due to
            an unexpected issue with processing. The order amount of ₹${order.totalAmount} will be refunded to your
            bank account shortly. We apologize for any inconvenience this may cause.
          </p>

          <p style="margin: 0; margin-top: 15px; line-height: 1.5">
            If you have any questions or need any further assistance, our support team is here to
            help.
          </p>

          <p style="margin: 0; margin-top: 15px; line-height: 1.5">
            Thank you for choosing us. We hope to have the pleasure of serving you again in the
            future.
          </p>
        </div>

        <div
          style="
            margin-top: 25px;
            text-align: center;
            padding-top: 25px;
            border-top: 1px solid #ddd;
            font-size: 14px;
            color: #777;
          "
        >
          <p style="margin: 0">Best regards,</p>
          <p style="margin: 0; margin-top: 10px">Shopease</p>
          <p style="margin: 0; margin-top: 10px">
            <a style="text-decoration: none" href=${BUSINESS_INFO.WEBSITE_URL} target="_blank">Visit our website</a>
            <span style="padding: 7px; color: #848484; position: relative; bottom: 0.5px">|</span>
            <a style="text-decoration: none" href="mailto:${BUSINESS_INFO.CONTACT_EMAIL}">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
`;