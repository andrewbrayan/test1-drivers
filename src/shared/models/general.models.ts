export class requestResponse {
    statusCode: number;
    status: 'OK' | 'Created' | 'Accepted' | 'Bad Request' | 'Conflict' | 'Unauthorized';
    message: string;
    data: any;
}