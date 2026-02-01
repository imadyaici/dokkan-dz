import { NextResponse } from "next/server";

// Order delivery type (1 for home, 2 for stop desk and 3 for pickup_point)
enum DeliveryType {
  HOME = 1,
  STOP_DESK = 2,
  PICKUP_POINT = 3,
}

export async function POST(req: Request) {
  const body = await req.json();

  const MAYSTRO_API_URL = `${process.env.NEXT_PUBLIC_MAYSTRO_BASE_URL}/orders/`;
  const MAYSTRO_API_SECRET = process.env.MAYSTRO_API_SECRET;

  const payload = {
    customer_name: body.name,
    customer_phone: body.phone,
    destination_text: body.address,
    external_id: body.product._id,
    product_price: body.product.price * body.quantity,
    delivery_type: body.delivery_type === "stopdesk" ? DeliveryType.STOP_DESK : body.delivery_type === "pickup" ? DeliveryType.PICKUP_POINT : DeliveryType.HOME,
    commune: body.city,
    details: [
      {
        product: body.product.name.fr,
        description: body.product.description.fr,
        quantity: body.quantity,
      }
    ]
  }

  const response = await fetch(MAYSTRO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `token ${MAYSTRO_API_SECRET}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
