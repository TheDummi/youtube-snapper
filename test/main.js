/** @format */

import YoutubeClient from '../dist/client/YoutubeClient.js';

const video = new YoutubeClient('https://www.youtube.com/watch?v=Bag1gUxuU0g', {
	quality: 'highest',
});

// console.log(await video.snap([15, 30, 45, 60, 75, 90, 105, 120, 135, 150], { dirname: './test/snaps' }));
console.log(await video.clip(15, 80, { dirname: './test/clips' }));
