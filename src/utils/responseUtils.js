export const responseUtils = {
  success: (resp, { data, status = 200 }) => {
    return resp.status(status).send({ data, success: true });
  },
};
