import request from '@/utils/request'

// 查询复诊信息列表
export function listRediag(query) {
  return request({
    url: '/system/rediag/list',
    method: 'get',
    params: query
  })
}

// 查询复诊信息详细
export function getRediag(rediagId) {
  return request({
    url: '/system/rediag/' + rediagId,
    method: 'get'
  })
}

// 新增复诊信息
export function addRediag(data) {
  return request({
    url: '/system/rediag',
    method: 'post',
    data: data
  })
}

// 修改复诊信息
export function updateRediag(data) {
  return request({
    url: '/system/rediag',
    method: 'put',
    data: data
  })
}

// 删除复诊信息
export function delRediag(rediagId) {
  return request({
    url: '/system/rediag/' + rediagId,
    method: 'delete'
  })
}
