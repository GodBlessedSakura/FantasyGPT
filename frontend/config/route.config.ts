export default [
    { exact: true, path: '/', redirect:'/chat' },
    {path:'/chat',component:'./Chat',routes:[
      {path:'/chat', exact:true,component:'./Chat/Main/default.tsx'},
      {path:'/chat/:id',component:'./Chat/Main/$index.tsx'}
    ]},
    { path: '/login', component: './Login' },

  ]