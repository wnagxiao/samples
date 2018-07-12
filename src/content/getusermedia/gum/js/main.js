/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
import {LitElement, html} from '@polymer/lit-element';

class GetUserMediaSample extends LitElement {
  _render({errorMessage, successMessage}) {
    return html`
<div id="container">

    <div class="highlight">
        <p>New codelab: <a href="https://codelabs.developers.google.com/codelabs/webrtc-web">Realtime communication with
            WebRTC</a></p>
    </div>

    <h1>
    <a href="//webrtc.github.io/samples/" title="WebRTC samples homepage">WebRTC samples</a> <span>getUserMedia</span>
    </h1>

    <video id="gum-local" autoplay playsinline></video>

    <div id="successMsg">${successMessage}</div>
    <div id="errorMsg">${errorMessage}</div>

    <p>Display the video stream from <code>getUserMedia()</code> in a video element.</p>

    <p>The <code>MediaStream</code> object <code>stream</code> passed to the <code>getUserMedia()</code> callback is in
        global scope, so you can inspect it from the console.</p>

    <a href="https://github.com/webrtc/samples/tree/gh-pages/src/content/getusermedia/gum"
       title="View source for this page on GitHub" id="viewSource">View source on GitHub</a>
</div>
    `;
  }

  constructor() {
    super();
    this.successMessage = '';
    this.errorMessage = '';
  }

  static get properties() { return {errorMessage: String, successMessage: String};}

  async _setupCamera() {
    const constraints = window.constraints = {audio: false, video: true};

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this._handleSuccess(stream, constraints);
    } catch (e) {
      this._handleError(e);
    }
  }

  _firstRendered() {
    super._firstRendered();
    this._setupCamera();
  }

  _handleSuccess(stream, constraints) {
    const video = this.shadowRoot.querySelector('#gum-local');
    const videoTracks = stream.getVideoTracks();
    this.successMessage = `Got stream with constraints: ${JSON.stringify(constraints)}. ` +
      `Using video device: ${videoTracks[0].label}`;
    console.log(this.successMessage);
    window.stream = stream; // make variable available to browser console
    video.srcObject = stream;
  }

  _handleError(error) {
    if (error.name === 'ConstraintNotSatisfiedError') {
      const v = this.shadowRoot.querySelector('#gum-local');
      this.errorMessage = `The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`;
    } else if (error.name === 'PermissionDeniedError') {
      this.errorMessage = 'Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.';
    }
  }
}

customElements.define('gum-sample', GetUserMediaSample);
