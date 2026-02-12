<script>
import { defineComponent, h } from 'vue';
import renderVcode from './renderVcode';
import parseVcode from '@/lib/vcode2/parse';
import convertLegacyVcode from './convert';

const LEGACY_VCODE_PATTERN = /##[a-zA-Z\-]+(?:\|[a-zA-Z]*=\"[\s\S]*?\")?(?:\{[\s\S]*?\})?/;

const safeJsonArrayParse = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return null;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
};

const containsLegacyToken = (nodes) => {
  if (!Array.isArray(nodes)) return false;
  return nodes.some((node) => typeof node === 'string' && LEGACY_VCODE_PATTERN.test(node));
};

const coerceVcodeBody = (input) => {
  const jsonParsed = safeJsonArrayParse(input);
  if (jsonParsed) return jsonParsed;

  if (Array.isArray(input)) return input;

  if (typeof input === 'string') {
    const parsed = parseVcode(input);
    return Array.isArray(parsed) ? parsed : [];
  }

  return null;
};

const createElementCompat = (type, options, children) => {
  if (options == null || Array.isArray(options) || typeof options === 'string' || typeof options === 'number') {
    return h(type, null, options);
  }

  const { props, attrs, class: className, style } = options;
  const mergedProps = {
    ...(attrs || {}),
    ...(props || {}),
    ...(className ? { class: className } : {}),
    ...(style ? { style } : {})
  };

  return h(type, mergedProps, children);
};

export default defineComponent({
  name: 'Vcode',
  props: {
    body: {
      type: [String, Object, Array],
      default: undefined
    },
    type: {
      type: String,
      default: 'div'
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    return () => {
      let body = null;

      if ((typeof props.body === 'object') && props.body && ('parsed' in props.body)) {
        body = coerceVcodeBody(props.body.parsed);
      } else {
        body = coerceVcodeBody(props.body);
      }

      if (containsLegacyToken(body)) {
        const legacySource = body.filter((node) => typeof node === 'string').join('\n');
        const converted = convertLegacyVcode(legacySource);
        body = coerceVcodeBody(converted);
      }

      if (!Array.isArray(body)) body = ['Error processing vcode.'];

      return createElementCompat(
        props.type || 'div',
        { class: 'vcode-document' },
        renderVcode(createElementCompat, props.data || {}, body)
      );
    };
  }
});
</script>
