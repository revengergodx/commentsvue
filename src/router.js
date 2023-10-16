import {createRouter, createWebHistory} from "vue-router";



const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/', component:() => import ('./views/main/Index.vue'),
            name: 'main.index'
        },
        {
            path: '/create', component:() =>import('./views/main/Create.vue'),
            name: 'main.create'
        },
        {
            path: '/:id', component:() => import ('./views/main/Show.vue'),
            name: 'main.show'
        },
    ],
})

export default router


