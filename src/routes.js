import React from 'react';

const ClientConstruction = React.lazy(() => import('./views/Client/Construction/Construction'));
const ClientProfile = React.lazy(() => import('./views/Client/Profile/Profile'));
const Logout = React.lazy(() => import('./views/System/Logout'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = 
[
  { path: '/client/construction', name: 'Construction', component: ClientConstruction },
  { path: '/client/profile', name: 'Profile', component: ClientProfile },
  { path: '/system/logout', name: 'Logout', component: Logout },
]

export default routes;
