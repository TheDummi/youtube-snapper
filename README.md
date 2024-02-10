<!-- @format -->

# youtube-snapper

A simple and intuitive youtube picture snapper and video clipper

## Index

> - [Requirements](#requirements)
> - [Methods](#methods)
> - [Examples](#examples)
>   - [snap](#clientsnap)
>   - [snip](#clientsnip)
>   - [duration](#clientduration)
> - [Disclaimers](#disclaimers)

## Requirements

> - This package
> - FFMPEG

## Methods

> - Client#snap
> - Client#clip
> - Client#duration

## Examples

Before we start, all code references towards `video` will come back to the following snippet.

```js
import YoutubeClient from 'youtube-snapper';

const video = new YoutubeClient(<YoutubeURL>, <YTDLOptions>);
```

### Client#snap

| options  | type   | default                 | description                             |
| -------- | ------ | ----------------------- | --------------------------------------- |
| dirname  | string | './snaps'               | The location of where the file is saved |
| filename | string | 'SNAP-\<TIMESTAMP>.png' | The base name of the file being saved   |

You can take as many pictures as there is seconds in a video (I think) with the following snippet:

```js
const response = await video.snap(
    [15, 30, 45, 60, 75, 90, 105, 120, 135, 150],
    { dirname: './snaps' }
);

/*  This snippet will take 10 snaps each occuring 15 seconds of each other.

    This will automatically create the dirname you assign or the default dirname which is `./snaps`.

    After taking all snaps it will return the following:
*/

{
  dirname: './snaps',
  dirpath: 'D:\\youtube-snapper\\snaps',
  files: [
    'SNAP-1707580174709_1.png',
    'SNAP-1707580174709_2.png',
    'SNAP-1707580174709_3.png',
    'SNAP-1707580174709_4.png',
    'SNAP-1707580174709_5.png',
    'SNAP-1707580174709_6.png',
    'SNAP-1707580174709_7.png',
    'SNAP-1707580174709_8.png',
    'SNAP-1707580174709_9.png',
    'SNAP-1707580174709_10.png'
  ],
  timestamps: [
    15,  30,  45,  60,  75,
    90, 105, 120, 135, 150
  ],
  time: 6581,
  url: 'https://www.youtube.com/watch?v=Bag1gUxuU0g',
  quality: 'highest',
  requestOptions: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36'
    }
  }
}
```

### Client#clip

| options  | type   | default                 | description                             |
| -------- | ------ | ----------------------- | --------------------------------------- |
| dirname  | string | './clips'               | The location of where the file is saved |
| filename | string | 'CLIP-\<TIMESTAMP>.mp4' | The base name of the file being saved   |

This method allows you to clip certain parts of videos. You can also clip the entire video if that's what you want. There is one small issue, currently clips are saved audioless, expect this to change in the future.

```js
const clip = await video.clip(15, 80, { dirname: './clips' });

/*
    This will clip starting from 15 seconds until it reaches either the end of the video or when the video is at 80 seconds.

    This method will also automatically make the dirname you provide or fallback onto the default dirname which is `./clips`.

    The output after creating the clip will look something a like:
*/

{
  dirname: './clips',
  dirpath: 'D:\\youtube-snapper\\clips',
  files: [ 'CLIP-1707580414207.mp4' ],
  timestamps: [ 15, 80 ],
  time: 13944,
  url: 'https://www.youtube.com/watch?v=Bag1gUxuU0g',
  quality: 'highest',
  requestOptions: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36'
  }
}
```

### Client#duration

| name     | type                                         | default  | description                                             |
| -------- | -------------------------------------------- | -------- | ------------------------------------------------------- |
| settings | Record<format, 'unix' \| 'full' \| 'simple'> | 'simple' | unix: unix timestamp<br>simple: h:m:s<br>full: hh:mm:ss |

Duration will simply return the duration of the video. I added it as I thought I needed full time string but ended up needing nothing more than timestamps. But since it was already there it can now be used as followed:

```js
const durationFull = await video.duration({ format: 'full' });
const durationSimple = await video.duration({ format: 'simple' });
const durationUnix = await video.duration({ format: 'unix' });

// Output:

// full
('00:04:34');

// simple
('4:34');

// unix
274;
```

## Disclaimers

> - I have noticed that setting the video quality settings on `highest` doesn't always save. If your video did not save try `lowest`, mostly music videos had this problem in my testing.
