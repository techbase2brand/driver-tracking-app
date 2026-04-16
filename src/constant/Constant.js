export const GOOGLE_MAPS_APIKEY = 'AIzaSyBEQp-ZFMYZjsTNyximu2pAifQ9EWA4W3M';
export const BACKEND_URL = 'https://foam-writers-ruled-eliminate.trycloudflare.com/';
export const API_BASE_URL =
  'https://recreation-hollow-masters-validation.trycloudflare.com/api/';

/**
 * Client demo: no backend required. Set to false to use real API calls again
 * (LoginScreen / HomeScreen / OrderHistoryScreen / DriverScreen).
 */
// export const USE_STATIC_DEMO_MODE = true;
export const USE_STATIC_DEMO_MODE = false;

export const STATIC_DEMO_EMAIL = 'driver@yopmail.com';
export const STATIC_DEMO_PASSWORD = '12345678';

/** Fixed drop point for directions (matches previous HomeScreen DESTINATION). */
export const STATIC_DEMO_DESTINATION = {
  latitude: 30.678212,
  longitude: 76.667856,
  addressLabel: 'Demo delivery — Sector 17, Chandigarh',
};

/** Same shape as driverLogin success payload (see useSelector state.email.driver.email). */
export const STATIC_DEMO_LOGIN_RESPONSE = {
  driver: {
    email: STATIC_DEMO_EMAIL,
    name: 'Demo Driver',
  },
};

/** Same shape as /api/driverOrders JSON. */
export const STATIC_DEMO_ORDERS_RESPONSE = {
  getorderCreateData: [
    {
      id: 'demo-order-1',
      orderCreateData_id: 'DEMO-88421',
      billing_address: JSON.stringify({
        address1: '947 ,Phase 4 Mohali',
        phone: '9876543210',
      }),
    },
    {
      id: 'demo-order-2',
      orderCreateData_id: 'DEMO-88422',
      billing_address: JSON.stringify({
        address1: '1016,Sector 70 Mohali',
        phone: '9876500000',
      }),
    },
  ],
};
export const statuses = [
  { label: 'Picked Up', value: 'PICKED_UP' },
  { label: 'In Transit', value: 'IN_TRANSIT' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Failed', value: 'FAILED' },
];

export const orders = [
  {
    id: '1',
    title: 'Cold Coffee & Drinks',
    orderId: '#123445566',
    items: 4,
    date: '10 June, 2024',
    image:
      'https://plus.unsplash.com/premium_photo-1663858367001-89e5c92d1e0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '2',
    title: 'Burger & French Fries',
    orderId: '#123449900',
    items: 6,
    date: '10 May, 2024',
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '3',
    title: 'Burger & French Fries',
    orderId: '#123443344',
    items: 4,
    date: '10 May, 2024',
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '4',
    title: 'Burger & French Fries',
    orderId: '#12344009',
    items: 2,
    date: '10 May, 2024',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '5',
    title: 'Burger & French Fries',
    orderId: '#12344666655',
    items: 5,
    date: '10 May, 2024',
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '6',
    title: 'Burger & French Fries',
    orderId: '#1234554',
    items: 2,
    date: '10 May, 2024',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '7',
    title: 'Cold Coffee & Drinks',
    orderId: '#125566344',
    items: 2,
    date: '10 June, 2024',
    image:
      'https://plus.unsplash.com/premium_photo-1663858367001-89e5c92d1e0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '8',
    title: 'Cold Coffee & Drinks',
    orderId: '#12344',
    items: 4,
    date: '10 June, 2024',
    image:
      'https://plus.unsplash.com/premium_photo-1663858367001-89e5c92d1e0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '9',
    title: 'Cold Coffee & Drinks',
    orderId: '#12009344',
    items: 2,
    date: '10 June, 2024',
    image:
      'https://plus.unsplash.com/premium_photo-1663858367001-89e5c92d1e0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '10',
    title: 'Cold Coffee & Drinks',
    orderId: '#1237788044',
    items: 3,
    date: '10 June, 2024',
    image:
      'https://plus.unsplash.com/premium_photo-1663858367001-89e5c92d1e0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
  },
];
