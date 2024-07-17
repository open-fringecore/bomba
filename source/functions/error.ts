export class CustomError extends Error {
	data: any;

	constructor(message: string, data: any) {
		super(message);
		this.name = this.constructor.name;
		this.data = data;
		// This is needed for proper stack trace support in some environments
		Error.captureStackTrace(this, this.constructor);
	}
}
