/** @format */

import ytdl, { downloadOptions } from '@distube/ytdl-core';
import ffmpeg from 'fluent-ffmpeg';

import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const command = ffmpeg;

export default class YoutubeClient {
	declare readonly url;
	declare readonly stream;
	declare readonly info;
	declare readonly config;

	constructor(url: string, config: downloadOptions) {
		this.url = url;

		this.config = config;

		if (!ytdl.validateURL(this.url)) throw new Error('Not a valid URL!');

		this.stream = ytdl(this.url, config);

		this.info = ytdl.getInfo(this.url);

		this.duration = this.duration;

		this.snap = this.snap;

		this.clip = this.clip;
	}

	public async duration({ format }: { format: 'unix' | 'simple' | 'full' } = { format: 'simple' }) {
		const video = await this.info;

		const time = Number(video.videoDetails.lengthSeconds);

		const seconds = time % 60;

		const minutes = Math.floor(time / 60);

		const hours = Math.floor(minutes / 60);

		if (format == 'simple') return [hours, minutes, seconds].filter((x) => x).join(':');
		else if (format == 'full') return [hours, minutes, seconds].map((t) => String(t).padStart(2, '0')).join(':');
		else if (format == 'unix') return time;
		else return null;
	}

	public async snap(timestamps: Array<number | string>, settings: Partial<Settings> = {}) {
		const start = Number(new Date());

		settings.dirname = settings?.dirname || './snaps';
		settings.filename = settings?.filename || `SNAP-${Number(new Date())}.png`;

		if (!timestamps?.length) throw new Error('No timestamp given!');

		let files: Array<string> = [];

		return (
			await promisify((callback) =>
				command({ source: this.stream })
					.on('filenames', (filenames) => (files = filenames))
					.takeScreenshots({ fastSeek: true, timemarks: timestamps.map((t) => this.time(t, true)) as Array<number>, filename: settings.filename, size: '1920x1080' }, settings.dirname)
					.on('error', (error) => callback(error, 'error'))
					.on('end', () =>
						callback(null, {
							dirname: settings.dirname,
							dirpath: `${path.resolve(`./${settings.dirname}`)}`,
							files,
							timestamps,
							time: Number(new Date()) - start,
							url: this.url,
							...this.config,
						})
					)
			)
		)();
	}

	public async clip(start: number, end: number, settings: Partial<Settings> = {}) {
		const time = Number(new Date());

		settings.dirname = settings?.dirname || './clips';
		settings.filename = settings?.filename || `CLIP-${Number(new Date())}.mp4`;

		start = this.time(start, true) as number;
		end = this.time(end, true) as number;

		try {
			fs.readdirSync(path.resolve(settings.dirname));
		} catch {
			fs.mkdir(path.resolve(settings.dirname), (err) => err);
		}

		return await promisify((callback) =>
			command({ source: this.stream })
				.setStartTime(start)
				.setDuration(end - start)
				.saveToFile(`${settings.dirname}/${settings.filename}`)
				.on('error', (error) => callback(error, 'error'))
				.on('end', () =>
					callback(null, {
						dirname: settings.dirname,
						dirpath: `${path.resolve(`./${settings.dirname}`)}`,
						files: [settings.filename],
						timestamps: [start, end],
						time: Number(new Date()) - time,
						url: this.url,
						...this.config,
					})
				)
		)();
	}

	private time(timestamp: number | string, stamped: boolean = false) {
		if (typeof timestamp == 'string') {
			const [hours, minutes, seconds] = timestamp.split(':').length == 3 ? timestamp.split(':') : timestamp.split(':').length == 2 ? `00:${timestamp}`.split(':') : `00:00:${timestamp}`.split(':');

			timestamp = [Number(hours) * 3600, Number(minutes) * 60, Number(seconds)].reduce((a, b) => a + b, 0);
		}

		if (stamped) return timestamp;

		const seconds = timestamp % 60;

		const minutes = Math.floor(timestamp / 60);

		const hours = Math.floor(minutes / 60);

		return [hours, minutes, seconds].map((t) => String(t).padStart(2, '0')).join(':');
	}
}

type Settings = {
	dirname: string;
	filename: string;
};
