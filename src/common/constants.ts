export
const ApiUrl = '/api/v0';

export
const AppName = 'NotSo.Social (beta)';

export
const BaseUrl = 'https://notso.social';

export
const CookieName = AppName;

export
const AuthUser_tokensCookieName = `${CookieName}.AuthUserTokens`;

export
const AuthUserCookieName = `${CookieName}.AuthUser`;

export
const DefaultToastMsgDelay = 4000;

export
const IsDev = process.env.NODE_ENV !== 'production';

export
const ISODateStringLength = 24;

export
const IsSsr = typeof window === 'undefined';

export
const MaxPostAttachmentAnnotationLength = 200;

export
const MaxPostBodyLength = 1000;

export
const MaxPostCost = 1_00_000;

export
const MaxPostTitleLength = 100;

export
const MaxSearchTermSize = 100;

export
const MinPostBodyLength = 10;

export
const MinPostCost = 10;

export
const MinPostPoints = 10;

export
const MinPostTitleLength = 3;

export
const MongoIdLength = 24;

export
const OwnPostRatio = 0.5;

export
const PageSize = 10;

export
const PasswordMaxLength = 128;

export
const PasswordMinLength = 6;

export
const PasswordSaltLength = 10;

export
// Source: https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
const PunctuationRegex = /[^\p{L}\s]/gu;
// Not sure if this should be used or the other const PunctuationRegex = /[.,-/#!$%^&*;:{}""=\-_`~()@+?><[\]+]/g;

export
enum SettingTypes {
	foo ='bar',
}

export
const UsernameMaxLength = 24;

export
const UsernameMinLength = 3;

export
const BaseReq: RequestInit = {
	credentials: 'include',
	headers: {
		Accept: 'application/json, text/plain, */*',
		'Content-Type': 'application/json',
	},
};

export
enum DbCollections {
	AppMetadata = 'app-metadata',
	Games = 'games',
	Grams = 'grams',
	Notifications = 'notifications',
	Users = 'users',
	UsersMeta = 'users-meta',
}

export
const ExtendedWhitespaceRegex = /\s{2,}/g;

export
enum ModalActions {
	LoginRegister = 'login-register',
	Logout = 'logout',
}

export
const NotLoggedInErrMsg = {
	ok: false,
	msg: 'Not logged in',
};

export
enum Paths {
	Faq = '/faq',
	Home = '/',
	Settings = '/settings',
}

export
const SpecialCharacterCodes = {
	NBSP: '\u00A0',
	DOT: '\u2022',
	QUOTE: '\u0022',
};

export
// Source: https://99webtools.com/blog/list-of-english-stop-words/
const StopWords = [
	'a', 'able', 'about', 'across', 'after', 'all', 'almost', 'also', 'am',
	'among', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been',
	'but', 'by', 'can', 'cannot', 'could', 'dear', 'did', 'do', 'does', 'either',
	'else', 'ever', 'every', 'for', 'from', 'get', 'got', 'had', 'has', 'have',
	'he', 'her', 'hers', 'him', 'his', 'how', 'however', 'i', 'if', 'in', 'into',
	'is', 'it', 'its', 'just', 'least', 'let', 'like', 'likely', 'may', 'me',
	'might', 'most', 'must', 'my', 'neither', 'no', 'nor', 'not', 'of', 'off',
	'often', 'on', 'only', 'or', 'other', 'our', 'own', 'rather', 'said', 'say',
	'says', 'she', 'should', 'since', 'so', 'some', 'than', 'that', 'the',
	'their', 'them', 'then', 'there', 'these', 'they', 'this', 'tis', 'to',
	'too', 'twas', 'us', 'wants', 'was', 'we', 'were', 'what', 'when', 'where',
	'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'yet',
	'you', 'your', 'ain\'t', 'aren\'t', 'can\'t', 'could\'ve', 'couldn\'t',
	'didn\'t', 'doesn\'t', 'don\'t', 'hasn\'t', 'he\'d', 'he\'ll', 'he\'s',
	'how\'d', 'how\'ll', 'how\'s', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'isn\'t',
	'it\'s', 'might\'ve', 'mightn\'t', 'must\'ve', 'mustn\'t', 'shan\'t',
	'she\'d', 'she\'ll', 'she\'s', 'should\'ve', 'shouldn\'t', 'that\'ll',
	'that\'s', 'there\'s', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
	'wasn\'t', 'we\'d', 'we\'ll', 'we\'re', 'weren\'t', 'what\'d', 'what\'s',
	'when\'d', 'when\'ll', 'when\'s', 'where\'d', 'where\'ll', 'where\'s',
	'who\'d', 'who\'ll', 'who\'s', 'why\'d', 'why\'ll', 'why\'s', 'won\'t',
	'would\'ve', 'wouldn\'t', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve',
];

export
enum UserRoles {
	Admin = 'admin',
	User = 'user'
}
