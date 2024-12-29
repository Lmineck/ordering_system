export const formatDate = (dateString: string) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    const hour = dateString.slice(8, 10);
    const minute = dateString.slice(10, 12);
    const second = dateString.slice(12, 14);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

// now date를 string 으로 변환
// import { format } from 'date-fns';
// const now = new Date();
// const formattedTime = format(now, 'yyyyMMddHHmmss');
