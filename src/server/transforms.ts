import { PasswordSaltLength } from '@common/constants';
import { hash } from 'bcryptjs';

export
function passwordToHash(password: string) {
	return hash(password, PasswordSaltLength);
}
