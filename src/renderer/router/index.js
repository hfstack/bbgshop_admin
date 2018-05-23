import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
Vue.use(ElementUI);
Vue.use(Router)

export default new Router({
    scrollBehavior: () => ({y: 0}),
    routes: [
      {
          path: '/login',
          name: 'login',
          // component: require('@/components/LoginPage')
          component:resolve => require(['@/components/LoginPage'],resolve)

      },
      {
          path: '*',
          redirect: '/dashboard'
      },
        {
            path: '/',
            name: 'dashboard',
            redirect: '/dashboard'
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            // component: require('@/components/DashboardPage'),
            component:resolve => require(['@/components/DashboardPage'],resolve),
            children: [
                {
                    path: '/',
                    name: 'welcome',
                    // component: require('@/components/WelcomePage')
                    component:resolve => require(['@/components/WelcomePage'],resolve),

                },
                {
                    path: 'GoodsQuestionPage',
                    name: 'GoodsQuestionPage',
                    // component: require('@/components/Other/LoopIndexPage')
                    component:resolve => require(['@/components/Other/GoodsQuestionPage'],resolve),
                },
                {
                    path: 'loopindex',
                    name: 'loopindex',
                    // component: require('@/components/Other/LoopIndexPage')
                    component:resolve => require(['@/components/Other/LoopIndexPage'],resolve),
                },
                {
                    path: 'CouponPage',
                    name: 'CouponPage',
                    component:resolve => require(['@/components/Coupon/CouponPage'],resolve),
                    // component: require('@/components/Other/BarIndexPage')
                },
                {
                    path: 'addcoupon',
                    name: 'addcoupon',
                    component:resolve => require(['@/components/Coupon/AddCoupon'],resolve),
                    // component: require('@/components/Other/BarIndexPage')
                },
                {
                    path: 'goods',
                    name: 'goods',
                    component:resolve => require(['@/components/Goods/GoodsPage'],resolve),
                    // component: require('@/components/Goods/GoodsPage')
                },
                {
                    path: 'goods/add',
                    name: 'goods_add',
                    component:resolve => require(['@/components/Goods/GoodsAddPage'],resolve),
                    // component: require('@/components/Goods/GoodsAddPage')
                },
                {
                    path: 'category',
                    name: 'category',
                    component:resolve => require(['@/components/Category/CategoryPage'],resolve),
                    // component: require('@/components/Category/CategoryPage')
                },
                {
                    path: 'category/add',
                    name: 'category_add',
                    component:resolve => require(['@/components/Category/CategoryAddPage'],resolve),
                    // component: require('@/components/Category/CategoryAddPage')
                },
                {
                    path: 'brand',
                    name: 'brand',
                    component:resolve => require(['@/components/Brand/BrandPage'],resolve),
                    // component: require('@/components/Brand/BrandPage')
                },
                {
                    path: 'brand/add',
                    name: 'brand_add',
                    component:resolve => require(['@/components/Brand/BrandAddPage'],resolve),
                    // component: require('@/components/Brand/BrandAddPage')
                },
                {
                    path: 'order',
                    name: 'order',
                    component:resolve => require(['@/components/Order/OrderPage'],resolve),
                    // component: require('@/components/Order/OrderPage')
                },
                {
                    path: 'pendpayorder',
                    name: 'pendpayorder',
                    component:resolve => require(['@/components/Order/PendPayOrder'],resolve),
                    // component: require('@/components/Order/OrderPage')
                },
                {
                    path: 'pendoutorder',
                    name: 'pendoutorder',
                    component:resolve => require(['@/components/Order/PendOutOrder'],resolve),
                    // component: require('@/components/Order/OrderPage')
                },
                {
                    path: 'alreadyoutorder',
                    name: 'alreadyoutorder',
                    component:resolve => require(['@/components/Order/AlreadyOutOrder'],resolve),
                    // component: require('@/components/Order/OrderPage')
                },
                {
                    path: 'collagepage',
                    name: 'collagepage',
                    component:resolve => require(['@/components/Collage/CollagePage'],resolve),
                    // component: require('@/components/Order/OrderPage')
                },
                {
                    path: 'collage/add',
                    name: 'collage_add',
                    component:resolve => require(['@/components/Collage/CollageAdd'],resolve),
                    // component: require('@/components/Order/OrderPage')
                },
                {
                    path: 'refundorder',
                    name: 'refundorder',
                    component:resolve => require(['@/components/Order/RefundOrder'],resolve),
                    // component: require('@/components/Order/OrderPage')
                },
                {
                    path: 'order/detail',
                    name: 'order_detail',
                    component:resolve => require(['@/components/Order/OrderDetailPage'],resolve),
                    // component: require('@/components/Order/OrderDetailPage')
                },
                {
                    path: 'operate/topic',
                    name: 'topic',
                    component:resolve => require(['@/components/Topic/TopicPage'],resolve),
                    // component: require('@/components/Topic/TopicPage')
                },
              {
                path: 'operate/topic/add',
                name: 'topic_add',
                component:resolve => require(['@/components/Topic/TopicAddPage'],resolve),
                // component: require('@/components/Topic/TopicAddPage')
              },
              {
                path: 'user',
                name: 'user',
                component:resolve => require(['@/components/User/UserPage'],resolve),
                // component: require('@/components/User/UserPage')
              },
              {
                path: 'user/complaint',
                name: 'user_complaint',
                component:resolve => require(['@/components/User/ComplaintPage'],resolve),
                // component: require('@/components/User/ComplaintPage')
              },
              {
                path: 'bargain/bargainPage',
                name: 'bargain_Page',
                component:resolve => require(['@/components/bargain/bargainPage'],resolve),
                // component: require('@/components/User/ComplaintPage')
              },
              {
                path: 'bargain/bargainAdd',
                name: 'bargain_Add',
                component:resolve => require(['@/components/bargain/bargainAdd'],resolve),
                // component: require('@/components/User/ComplaintPage')
              },
            ]
        }

    ]
})
