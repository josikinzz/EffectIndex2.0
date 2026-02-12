import { _ as __nuxt_component_0 } from './Icon-xL9_OgMt.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { _ as _export_sfc } from './server.mjs';

const _imports_0 = publicAssetsURL("/spinner.svg");
let WaveSurfer = void 0;
const _sfc_main = {
  components: {
    Icon: __nuxt_component_0
  },
  props: {
    src: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    artist: {
      type: String,
      default: ""
    },
    audioRoutes: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      state: "UNREADY",
      id: null,
      length: 0,
      position: 0,
      wavesurfer: void 0
    };
  },
  computed: {
    audioInfo() {
      let r = {
        src: this.src,
        title: this.title,
        artist: this.artist
      };
      if (this.audioRoutes) {
        let routes = this.audioRoutes.split(",");
        routes.forEach((route) => {
          let info = route.split(":");
          let path = info[0] ? info[0].trim() : void 0;
          let src = info[1] ? info[1].trim() : this.src;
          let title = info[2] ? info[2].trim() : this.title;
          let artist = info[3] ? info[3].trim() : this.artist;
          if (this.$route.path.includes(path)) r = { src, title, artist };
        });
      }
      return r;
    }
  },
  watch: {
    src: function(val) {
      this.load();
    }
  },
  beforeDestroy() {
    this.pause();
    this.wavesurfer.unAll();
  },
  mounted() {
    this.wavesurfer = WaveSurfer.create({
      container: this.$refs.waveform,
      waveColor: "#555555",
      cursorColor: "#CCCCCC",
      progressColor: "#3d9991",
      height: "50",
      hideScrollbar: true,
      closeAudioContext: true,
      responsive: true
    });
    this.wavesurfer.on("ready", this.play);
    this.wavesurfer.on("audioprocess", this.audioProcess);
    this.wavesurfer.on("finish", this.finish);
  },
  methods: {
    load() {
      this.state = "LOADING";
      this.wavesurfer.load(this.audioInfo.src);
    },
    play() {
      this.state = "PLAYING";
      this.length = this.wavesurfer.getDuration();
      this.wavesurfer.play();
    },
    pause() {
      this.state = "PAUSED";
      this.wavesurfer.pause();
    },
    audioProcess() {
      this.position = this.wavesurfer.getCurrentTime();
    },
    finish() {
      this.state = "STOPPED";
      this.wavesurfer.seekTo(0);
    },
    getTime(time) {
      let minutes = Math.floor(time / 60);
      let seconds = Math.floor(time - minutes * 60);
      seconds = seconds.toString().length < 2 ? "0" + seconds.toString() : seconds;
      return `${minutes}:${seconds}`;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Icon = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "audioPlayer" }, _attrs))}><div class="audioPlayer__playButton">`);
  if ($data.state === "UNREADY") {
    _push(`<a>`);
    _push(ssrRenderComponent(_component_Icon, {
      filename: "play.svg",
      class: "audioPlayer__icon"
    }, null, _parent));
    _push(`</a>`);
  } else if ($data.state === "LOADING") {
    _push(`<a><img class="spinner"${ssrRenderAttr("src", _imports_0)}></a>`);
  } else if ($data.state === "STOPPED" || $data.state === "PAUSED") {
    _push(`<a>`);
    _push(ssrRenderComponent(_component_Icon, {
      filename: "play.svg",
      class: "audioPlayer__icon"
    }, null, _parent));
    _push(`</a>`);
  } else if ($data.state === "PLAYING") {
    _push(`<a>`);
    _push(ssrRenderComponent(_component_Icon, {
      filename: "pause.svg",
      class: "audioPlayer__icon"
    }, null, _parent));
    _push(`</a>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="audioPlayer__audioInfo"><div class="audioPlayer__titleBar"><div class="audioPlayer__title">${ssrInterpolate($options.audioInfo.title)}</div><div class="audioPlayer__artist">${ssrInterpolate($options.audioInfo.artist)}</div></div></div><div class="audioPlayer__waveform"></div><div class="audioPlayer__positionDownload"><div>${ssrInterpolate($options.getTime($data.position))} / ${ssrInterpolate($options.getTime($data.length))}</div><a${ssrRenderAttr("href", $props.src)} target="_blank"> Download </a></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/replications/audio/AudioPlayer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AudioPlayer = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { AudioPlayer as A };
//# sourceMappingURL=AudioPlayer-DSX_ItL1.mjs.map
