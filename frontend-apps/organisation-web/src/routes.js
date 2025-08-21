import React from "react";

const AboutPage = React.lazy(() => import("./AboutPage"));

const routes = [
  {
    path: "/about",
    component: AboutPage,
  },
];

export default routes;

// let element = useRoutes([
//   { path: '/', element: <Home /> },
//   { path: 'dashboard', element: <Dashboard /> },
//   {
//     path: 'invoices',
//     element: <Invoices />,
//     children: [
//       { path: ':id', element: <Invoice /> },
//       { path: 'sent', element: <SentInvoices /> }
//     ]
//   },
// ]);