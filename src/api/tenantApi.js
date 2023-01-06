import request from '@/utils/request';

export function pageTenant(param) {
    return request.get('/console/tenant/page', param);
}

export function saveTenant(body){

    return request.postJson('/console/tenant', body);
}
