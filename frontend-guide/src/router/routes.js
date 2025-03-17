import Layout from "@/layouts/HomeLayout.vue";

export const routes = [
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'containment/button',
        name: 'Button',
        component: () => import('@/views/containment/ButtonView.vue')
      },
      {
        path: 'containment/card',
        name: 'Card',
        component: () => import('@/views/containment/CardView.vue')
      },
      {
        path: 'containment/list',
        name: 'List',
        component: () => import('@/views/containment/ListView.vue')
      },
      {
        path: 'control/check-box',
        name: 'CheckBox',
        component: () => import('@/views/control/CheckBoxView.vue')
      },
      {
        path: 'control/combo-box',
        name: 'ComboBox',
        component: () => import('@/views/control/ComboBoxView.vue')
      },
      {
        path: 'control/text-field',
        name: 'TextField',
        component: () => import('@/views/control/TextFieldView.vue')
      },
      {
        path: 'data/data-table',
        name: 'Data Table',
        component: () => import('@/views/data/DataTableView.vue')
      },
      {
        path: 'navigation/bread-crumb',
        name: 'BreadCrumb',
        component: () => import('@/views/navigation/BreadCrumbView.vue')
      },
      {
        path: 'navigation/pagination',
        name: 'Pagination',
        component: () => import('@/views/navigation/PaginationView.vue')
      },
    ]
  },
]
