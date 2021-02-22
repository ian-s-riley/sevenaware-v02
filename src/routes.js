/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LocationOn from "@material-ui/icons/LocationOn";
import TableChart from "@material-ui/icons/TableChart";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import FormTemplate from "views/FormTemplate/FormTemplate.js";
import Forms from 'views/Forms/Forms'
import FormDetail from 'components/FormDetail/FormDetail'
import FieldDetail from 'components/FieldDetail/FieldDetail'
import Fields from 'views/Fields/Fields'
import Maps from "views/Maps/Maps.js";

const dashboardRoutes = [  
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/formtemplate",
    name: "Form Template",
    component: FormTemplate,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/formdetail",
    name: "Form Detail",
    component: FormDetail,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/fielddetail",
    name: "Field Detail",
    component: FieldDetail,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/forms",
    name: "Forms",
    icon: TableChart,
    component: Forms,
    layout: "/admin"
  },
  {
    path: "/fields",
    name: "Fields",
    icon: TableChart,
    component: Fields,
    layout: "/admin",
    invisible: true
  },  
  {
    path: "/user",
    name: "User Profile",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UserProfile,
    layout: "/admin"
  },  
  {
    path: "/maps",
    name: "Maps",
    icon: LocationOn,
    component: Maps,
    layout: "/admin",
    invisible: true,
  },
];

export default dashboardRoutes;
