const response = {
  ok:(ctx,data) => {
    ctx.body = Object.assign({},data)
  },
  error:(ctx,errMsg,code = 400) => {
    ctx.status = code;
    ctx.body = {
      error:errMsg
    }
  }
}

export default response;