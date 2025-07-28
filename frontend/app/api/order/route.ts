import { NextResponse } from "next/server";

// Order delivery type (1 for home, 2 for stop desk and 3 for pickup_point)
enum DeliveryType {
  HOME = 1,
  STOP_DESK = 2,
  PICKUP_POINT = 3,
}

export async function POST(req: Request) {
  const body = await req.json();

  const MAYSTRO_API_URL = process.env.MAYSTRO_API_URL as string;
  const MAYSTRO_API_SECRET = process.env.MAYSTRO_API_SECRET;

  console.log("Received order:", body);

  const payload = {
    customer_name: body.name,
    customer_phone: body.phone,
    destination_text: body.address,
    external_id: body.product._id,
    product_price: body.product.price * body.quantity,
    delivery_type: DeliveryType.HOME,
    commune: body.city,
    details: [
      {
        product: body.product._id,
        description: body.product.name,
        quantity: body.quantity,
      }
    ]
  }

  const response = await fetch(MAYSTRO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${MAYSTRO_API_SECRET}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
