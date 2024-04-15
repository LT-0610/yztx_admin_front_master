import request from '@/utils/request'

// 查询话题信息列表
export function listTalk(query) {
  return request({
    url: '/system/talk/list',
    method: 'get',
    params: query
  })
}

// 查询话题信息详细
export function getTalk(id) {
  return request({
    url: '/system/talk/' + id,
    method: 'get'
  })
}

// 新增话题信息
export function addTalk(data) {
  return request({
    url: '/system/talk',
    method: 'post',
    data: data
  })
}

// 修改话题信息
export function updateTalk(data) {
  return request({
    url: '/system/talk',
    method: 'put',
    data: data
  })
}

// 删除话题信息
export function delTalk(id) {
  return request({
    url: '/system/talk/' + id,
    method: 'delete'
  })
}
