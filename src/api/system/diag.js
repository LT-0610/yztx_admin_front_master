import request from '@/utils/request'

// 查询病历初诊信息表列表
export function listDiag(query) {
  return request({
    url: '/system/diag/list',
    method: 'get',
    params: query
  })
}

// 查询病历初诊信息表详细
export function getDiag(diagId) {
  return request({
    url: '/system/diag/' + diagId,
    method: 'get'
  })
}

// 新增病历初诊信息表
export function addDiag(data) {
  return request({
    url: '/system/diag',
    method: 'post',
    data: data
  })
}

// 修改病历初诊信息表
export function updateDiag(data) {
  return request({
    url: '/system/diag',
    method: 'put',
    data: data
  })
}

// 删除病历初诊信息表
export function delDiag(diagId) {
  return request({
    url: '/system/diag/' + diagId,
    method: 'delete'
  })
}
