/**
 *  에러 log 출력 및 알림창 띄우기
 */
export function handleErrorWithAlert(err) {
    if (err.response && err.response.data && err.response.data.message) {
        const errorMessage = err.response.data.message;
        console.log(errorMessage);
        alert(errorMessage);
    } else {
        console.error('에러가 발생했습니다:', err);
        alert('알 수 없는 에러가 발생했습니다.');
    }
}

/**
 * 알 수 없는 에러 발생 핸들링
 */
export function handleAnonymousError(err) {
    console.error('에러가 발생했습니다:', err);
    alert('알 수 없는 에러가 발생했습니다.');
}

/**
 * 예외 log 출력
 */
export function consoleError(err) {
    console.log(err.response);
    console.log(err.response.data);
    console.log(err.response.data.message);
    if (err.response && err.response.data && err.response.data.message) {
        console.error(err.response.data.message);
    } else {
        console.error('에러가 발생했습니다:', err);
    }
}