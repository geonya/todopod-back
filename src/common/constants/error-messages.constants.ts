const errorMessage = {
  ko: {
    common: {
      internalError: 'Internal Error : ',
      pageNumberError: '페이지 번호는 1보다 커야 합니다.',
    },
    user: {
      userNotFound: '존재하지 않는 유저입니다.',
      notAuthorized: '권한이 없습니다.',
      emailExisting: '존재하는 이메일입니다.',
      passwordWrong: '비밀번호가 틀렸습니다.',
    },
    project: {
      notFound: '존재하지 않는 프로젝트입니다.',
      notAuthorized: '권한이 없습니다.',
    },
    task: {},
    product: {},
  },
}

export default errorMessage