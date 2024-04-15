<template>
  <div>
    <!-- 图片上传部分保持不变 -->
    <el-upload
      :action="uploadUrl"
      :before-upload="handleBeforeUpload"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      name="file"
      :show-file-list="false"
      :headers="headers"
      style="display: none"
      ref="upload"
      v-if="this.type == 'url'"
    >
    </el-upload>
    <!-- 视频上传部分 -->
    <el-upload
      class="upload-video"
      :action="uploadUrl"
      :before-upload="handleVideoBeforeUpload"
      :on-success="handleVideoUploadSuccess"
      :on-error="handleVideoUploadError"
      name="file"
      :show-file-list="false"
      :headers="headers"
      style="display: none"
      ref="videoUpload"
      v-if="this.type == 'url'"
    >
    </el-upload>
    <!-- 编辑器部分保持不变 -->
    <div class="editor" ref="editor" :style="styles"></div>
  </div>
</template>

<script>
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import Video from "./video";
Quill.register(Video, true);
import { getToken } from "@/utils/auth";
import { ImageDrop } from 'quill-image-drop-module'
Quill.register('modules/imageDrop', ImageDrop);
import { ImageExtend } from 'quill-image-extend-module'
import ImageResize from 'quill-image-resize-module'
Quill.register('modules/imageResize', ImageExtend);
Quill.register('modules/imageResize', ImageResize);

export default {
  name: "Editor",
  props: {
    /* 编辑器的内容 */
    value: {
      type: String,
      default: "",
    },
    /* 高度 */
    height: {
      type: Number,
      default: null,
    },
    /* 最小高度 */
    minHeight: {
      type: Number,
      default: null,
    },
    /* 只读 */
    readOnly: {
      type: Boolean,
      default: false,
    },
    // 上传文件大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    /* 类型（base64格式、url格式） */
    type: {
      type: String,
      default: "url",
    }
  },
  data() {
    return {
      uploadUrl:  "http://localhost:8080"+"/uploadOss" , // 上传的视频服务器地址，根据实际情况修改
      headers: {
        Authorization: "Bearer " + getToken()
      },
      Quill: null,
      currentValue: "",
      options: {
        theme: "snow",
        bounds: document.body,
        debug: "warn",
        modules: {
          imageDrop: true,
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          },
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"],
            ["link", "image", "video"] // 添加视频按钮
          ],
        },
        placeholder: "请输入内容",
        readOnly: this.readOnly,
      },
    };
  },
  computed: {
    styles() {
      let style = {};
      if (this.minHeight) {
        style.minHeight = `${this.minHeight}px`;
      }
      if (this.height) {
        style.height = `${this.height}px`;
      }
      return style;
    },
  },
  watch: {
    value: {
      handler(val) {
        if (val !== this.currentValue) {
          this.currentValue = val === null ? "" : val;
          if (this.Quill) {
            this.Quill.pasteHTML(this.currentValue);
          }
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.Quill = null;
  },
  methods: {
    init() {
      const editor = this.$refs.editor;
      this.Quill = new Quill(editor, this.options);
      if (this.type == 'url') {
        let toolbar = this.Quill.getModule("toolbar");
        toolbar.addHandler("image", (value) => {
          this.uploadType = "image";
          if (value) {
            this.$refs.upload.$children[0].$refs.input.click();
          } else {
            this.quill.format("image", false);
          }
        });
        // 添加视频上传的按钮点击事件
        toolbar.addHandler("video", () => {
          this.uploadType = "video";
          this.$refs.videoUpload.$children[0].$refs.input.click();
        });
      }
      this.Quill.pasteHTML(this.currentValue);
      this.Quill.on("text-change", (delta, oldDelta, source) => {
        const html = this.$refs.editor.children[0].innerHTML;
        const text = this.Quill.getText();
        const quill = this.Quill;
        this.currentValue = html;
        this.$emit("input", html);
        this.$emit("on-change", { html, text, quill });
      });
      this.Quill.on("text-change", (delta, oldDelta, source) => {
        this.$emit("on-text-change", delta, oldDelta, source);
      });
      this.Quill.on("selection-change", (range, oldRange, source) => {
        this.$emit("on-selection-change", range, oldRange, source);
      });
      this.Quill.on("editor-change", (eventName, ...args) => {
        this.$emit("on-editor-change", eventName, ...args);
      });
    },
    // 图片上传前校验格式和大小
    handleBeforeUpload(file) {
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      return true;
    },
    // 视频上传前校验格式和大小
    handleVideoBeforeUpload(file) {
      // 可根据需要进行视频格式和大小的校验
      return true;
    },
    // 图片上传成功回调
    handleUploadSuccess(res) {
      let quill = this.Quill;
      if (res.code == 200) {
        let length = quill.getSelection().index;
        quill.insertEmbed(length, "image", res.url);
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
    },
    // 视频上传成功回调
    handleVideoUploadSuccess(res) {
      let quill = this.Quill;
      if (res.code == 200) {
        let length = quill.getSelection().index;
        // 插入视频，res.url为服务器返回的视频地址
        quill.insertEmbed(length, "video", res.url);
        quill.setSelection(length + 1);
      } else {
        this.$message.error("视频插入失败");
      }
    },
    // 图片上传失败回调
    handleUploadError() {
      this.$message.error("图片插入失败");
    },
    // 视频上传失败回调
    handleVideoUploadError() {
      this.$message.error("视频插入失败");
    },
  },
};
</script>

