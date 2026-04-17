window.emitLitDebugLogEvents = true;

const LitElement = Object.getPrototypeOf(
  customElements.get('ha-panel-lovelace')
);
const { css, html, nothing } = LitElement.prototype;

const CUSTOM_CARD_NAME = 'fyta-garden-card';

const DecimalsState = {
  UNTOUCHED: false,
  ZERO: 0,
  ONE: 1,
};

const DeviceClass = {
  BATTERY: 'battery',
  MOISTURE: 'moisture',
  TEMPERATURE: 'temperature',
};

const EntityType = {
  IMAGE: 'image',
  SENSOR: 'sensor',
};

const MeasurementStatusStates = {
  NO_DATA: 'no_data',
  TOO_LOW: 'too_low',
  LOW: 'low',
  PERFECT: 'perfect',
  HIGH: 'high',
  TOO_HIGH: 'too_high',
};

const MeasurementStatusColors = {
  [MeasurementStatusStates.NO_DATA]: 'var(--disabled-text-color, #bdbdbd)',
  [MeasurementStatusStates.TOO_LOW]: 'var(--red-color, #f44336)',
  [MeasurementStatusStates.LOW]: 'var(--orange-color, #ff9800)',
  [MeasurementStatusStates.PERFECT]: 'var(--green-color, #4caf50)',
  [MeasurementStatusStates.HIGH]: 'var(--orange-color, #ff9800)',
  [MeasurementStatusStates.TOO_HIGH]: 'var(--red-color, #f44336)',
};

const PlantStatusStates = {
  DELETED: 'deleted',
  DOING_GREAT: 'doing_great',
  NEED_ATTENTION: 'need_attention',
  NO_SENSOR: 'no_sensor',
};

const PlantStautsColors = {
  [PlantStatusStates.DELETED]: 'var(--disabled-text-color, #bdbdbd)',
  [PlantStatusStates.DOING_GREAT]: 'var(--green-color, #4caf50)',
  [PlantStatusStates.NEED_ATTENTION]: 'var(--orange-color, #ff9800)',
  [PlantStatusStates.NO_SENSOR]: 'var(--disabled-text-color, #bdbdbd)',
};

const PlantStateColorState = {
  DISABLED: 'disabled',
  IMAGE: 'image',
  NAME: 'name',
};

const PreferredPlantImage = {
  USER: 'user',
  DEFAULT: 'default',
};

const SensorTypes = {
  BATTERY: 'battery',
  FERTILIZATION_LAST: 'fertilizationLast',
  FERTILIZATION_NEXT: 'fertilizationNext',
  LIGHT: 'light',
  LIGHT_STATE: 'light_status',
  MOISTURE: 'moisture',
  MOISTURE_STATE: 'moisture_status',
  NUTRIENTS: 'nutrients',
  NUTRIENTS_STATE: 'nutrients_status',
  PLANT_IMAGE_DEFAULT: 'plant_image_default',
  PLANT_IMAGE_USER: 'plant_image_user',
  PLANT_STATE: 'plant_status',
  SALINITY: 'salinity',
  SALINITY_STATE: 'salinity_status',
  SCIENTIFIC_NAME: 'scientific_name',
  TEMPERATURE: 'temperature',
  TEMPERATURE_STATE: 'temperature_status',
};

const TranslationKeys = {
  FERTILIZATION_LAST: 'last_fertilised',
  FERTILIZATION_NEXT: 'next_fertilisation',
  LIGHT: 'light',
  LIGHT_STATUS: 'light_status',
  MOISTURE_STATUS: 'moisture_status',
  NUTRIENTS_STATUS: 'nutrients_status',
  PLANT_IMAGE_DEFAULT: 'plant_image_default',
  PLANT_IMAGE_USER: 'plant_image_user',
  PLANT_STATUS: 'plant_status',
  SALINITY: 'salinity',
  SALINITY_STATUS: 'salinity_status',
  SCIENTIFIC_NAME: 'scientific_name',
  TEMPERATURE_STATUS: 'temperature_status',
};

const DEFAULT_CONFIG = {
  battery_threshold: 30,
  decimals: DecimalsState.UNTOUCHED,
  device_ids: [],
  sensors: [
    { type: SensorTypes.LIGHT, isEnabled: true },
    { type: SensorTypes.MOISTURE, isEnabled: true },
    { type: SensorTypes.TEMPERATURE, isEnabled: true },
    { type: SensorTypes.NUTRIENTS, isEnabled: true },
    { type: SensorTypes.SALINITY, isEnabled: false },
  ],
  preferred_image: PreferredPlantImage.USER,
  show_scientific_name: true,
  state_color_battery: true,
  state_color_plant: PlantStateColorState.NAME,
  state_color_sensor: true,
  title: '',
};
 
const SCHEMA_PART_ONE = [
  {
    name: 'title',
    label: 'Title',
    selector: {
      text: {},
    },
    default: DEFAULT_CONFIG.title,
  },
  {
    name: 'header_devices',
    type: 'constant',
    label: 'Devices',
  },
];

const SCHEMA_PART_TWO = [
  {
    name: 'header_measurements',
    type: 'constant',
    label: 'Sensor Measurements',
  },
  {
    name: 'battery_threshold',
    label: 'Battery Threshold (%)',
    selector: {
      number: {
        min: 0,
        max: 100,
        step: 5,
        mode: 'slider',
      },
    },
    default: DEFAULT_CONFIG.battery_threshold,
  },
];

const SCHEMA_PART_THREE = [
  {
    name: 'nutrition_info',
    type: 'constant',
    label: 'Nutrition and Salinity',
    value: 'The Nutrition Score combines multiple measurements (salinity, conductivity, growth data, and fertilization timing) into a single metric. Showing salinity separately is generally not needed as it is already included in this score.',
  },
  {
    name: 'header_layout',
    type: 'constant',
    label: 'Layout',
  },
  {
    name: 'preferred_image',
    label: 'Preferred plant image',
    selector: {
      select: {
        options: [
          { label: 'User Image', value: PreferredPlantImage.USER },
          { label: 'Default Image', value: PreferredPlantImage.DEFAULT },
        ],
        mode: 'box',
      },
    },
    default: DEFAULT_CONFIG.preferred_image,
  },
  {
    name: 'state_color_plant',
    label: 'Expose plant state',
    selector: {
      select: {
        options: [
          { label: 'Name Color', value: PlantStateColorState.NAME },
          { label: 'Image Halo', value: PlantStateColorState.IMAGE },
          { label: 'Disabled', value: PlantStateColorState.DISABLED },
        ],
        mode: 'box',
      },
    },
    default: DEFAULT_CONFIG.state_color_plant,
  },
  {
    type: 'grid',
    schema: [
      {
        name: 'show_scientific_name',
        label: 'Show scientific name',
        type: 'boolean',
        selector: { boolean: {} },
        default: DEFAULT_CONFIG.show_scientific_name,
      },
    ],
  },
  {
    type: 'grid',
    schema: [
      {
        name: 'state_color_sensor',
        label: 'Show sensor state color',
        selector: { boolean: {} },
        default: DEFAULT_CONFIG.state_color_sensor,
      },
      {
        name: 'state_color_battery',
        label: 'Show battery state color',
        selector: { boolean: {} },
        default: DEFAULT_CONFIG.state_color_battery,
      },
    ],
  },
  {
    name: 'decimals',
    label: 'Sensor reading decimals',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { label: 'Unchanged', value: DecimalsState.UNTOUCHED },
          { label: '0', value: DecimalsState.ZERO },
          { label: '1', value: DecimalsState.ONE },
        ],
      },
    },
    default: DEFAULT_CONFIG.decimals,
  },
];

const SENSOR_SETTINGS = {
  [SensorTypes.BATTERY]: {
    min: 0,
    max: 100,
    icon: 'mdi:battery',
    name: 'Battery',
  },
  [SensorTypes.LIGHT]: {
    icon: 'mdi:white-balance-sunny',
    name: 'Light',
  },
  [SensorTypes.MOISTURE]: {
    min: 0,
    max: 100,
    icon: 'mdi:water',
    name: 'Soil Moisture',
  },
  [SensorTypes.NUTRIENTS]: {
    icon: 'mdi:bucket',
    name: 'Nutrition',
  },
  [SensorTypes.TEMPERATURE]: {
    min: 0,
    max: 50,
    icon: 'mdi:thermometer',
    name: 'Ambient Temperature',
  },
  [SensorTypes.SALINITY]: {
    icon: 'mdi:water-percent',
    name: 'Salinity',
  },
};

const parseConfig = (config) => {
  // Create a completely new config object with all defaults set
  const newConfig = { ...DEFAULT_CONFIG, ...config };

  return newConfig;
};

class FytaGardenCard extends LitElement {
  static getConfigElement() {
    return document.createElement(`${CUSTOM_CARD_NAME}-editor`);
  }

  static getStubConfig() {
    return DEFAULT_CONFIG;
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._configDeviceIds = [];
  }

  _calculateSize(gridSize) {
    // Calculate card size dependent tile and number of devices shown
    const hasTitle = this.config?.title && this.config.title.trim() !== '';
    const baseHeight = 20 + (hasTitle ? 76 : 0);

    const deviceCount = this.config?.device_ids.length || 0;
    const devicesHeight = 80 * deviceCount;

    const cardHeight = baseHeight + devicesHeight;

    return Math.ceil(cardHeight / gridSize * 2) / 2;
  }

  getCardSize() {
    return this._calculateCardSize(40);
  }

  getLayoutOptions() {
    const gridRows = this._calculateSize(56);

    return {
      grid_rows: gridRows,
      grid_columns: 4,
      grid_min_rows: 3,
      grid_min_columns: 2,
    };
  }

  render() {
    if (!this.config || !this.hass) {
      return nothing;
    }

    const { title } = this.config;

    // If no device is specified, show a configuration prompt
    if (!this._configDeviceIds.length || !this._configDeviceIds[0]) {
      return html`
        <ha-card .header=${title}>
          <hui-warning>
            Please select at least one FYTA device in the card configuration.
          </hui-warning>
        </ha-card>`;
    }

    const onClick = (event) => {
      // Find the closest clickable element
      const clickableElement = event.target.closest('[data-entity], img, #name, #scientific-name, .battery, .attribute');
      if (clickableElement) {
        const entityId = clickableElement.dataset.entity || this._stateEntityIds[SensorTypes.PLANT_STATE];
        if (entityId) {
          this._click(entityId);
          event.stopPropagation();
        }
      }
    };

    return html`
      <ha-card .header=${title} onClick=${onClick}>
        <div class="content${!title ? ' no-header' : ''}">
          <div class="header">
            ${this.config.sensors.map((sensorSettings) => {
              if (sensorSettings.isEnabled) {
                return html`<ha-icon icon="${SENSOR_SETTINGS[sensorSettings.type].icon}"></ha-icon>`;
              }
            })}
          </div>
          ${this._configDeviceIds.map((deviceId, index, array) => {
            if (!deviceId) {
              return nothing;
            }

            return html`
              <div class="item" data-device-id="${deviceId}">
                ${this._renderDevice(deviceId, this.hass)}
              </div>
              ${index < array.length - 1 ? html`<div class="divider"></div>` : nothing}
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    const newConfig = parseConfig(config);
    this.config = newConfig;
    this._configDeviceIds = newConfig.device_ids.filter((deviceId) => deviceId);

    if (this.hass) {
      this.requestUpdate();
    }
  }

  _calculateDaysFromNow(inputDateString) {
    if (!inputDateString) return null;

    // Create Date object for the current date - use local midnight
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Create Date object for the input date handling ISO input format (YYYY-MM-DDThh:mm:ss)
    const inputDate = new Date(inputDateString);

    // Calculate time difference in milliseconds
    const timeDifference = inputDate.getTime() - currentDate.getTime();

    // Convert milliseconds to days
    const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
    return Math.ceil(timeDifference / DAY_IN_MILLISECONDS);
  }

  _click(entityId) {
    if (!entityId) return;
    const event = new Event(('hass-more-info'), {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
    event.detail = { entityId };
    this.dispatchEvent(event);
    return event;
  }

  _getStateColor(stateType, deviceEntityIds, hass) {
    switch (stateType) {
      case SensorTypes.LIGHT_STATE:
      case SensorTypes.MOISTURE_STATE:
      case SensorTypes.NUTRIENTS_STATE:
      case SensorTypes.SALINITY_STATE:
      case SensorTypes.TEMPERATURE_STATE: {
        const entityId = deviceEntityIds[stateType];
        const state = hass.states[entityId]?.state || MeasurementStatusColors.NO_DATA;
        return MeasurementStatusColors[state];
      }
      case SensorTypes.PLANT_STATE: {
        const entityId = deviceEntityIds[stateType];
        const state = hass.states[entityId]?.state || PlantStatusStates.NO_SENSOR;
        return PlantStautsColors[state];
      }
      default: {
        return 'var(--primary-text-color, #ffffff)';
      }
    }
  }

  // Format date for display: Remove time component
  _formatDateForDisplay(dateString) {
    if (!dateString) return '';

    // If date contains a T (ISO format), split and return just the date part
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }

    return dateString;
  }

  _formatDecimals(value, decimals = 0) {
    const numberValue = Number(value);
    return isNaN(numberValue) ? '' : numberValue.toFixed(decimals);
  }

  // Format unit for card display (only show part before "/" if it exists)
  _formatDisplayUnit(unit) {
    if (!unit) return '';
    const parts = unit.split('/');
    return parts[0];
  }

  _getPlantImageSrc(hass, deviceEntityIds) {
    if (this.config.preferred_image === PreferredPlantImage.USER) {
      const userImageEntityId = deviceEntityIds[SensorTypes.PLANT_IMAGE_USER];

      if (userImageEntityId && hass.states[userImageEntityId]?.attributes.entity_picture) {
        return hass.states[userImageEntityId]?.attributes.entity_picture || '';
      }
    }

    const defaultImageEntityId = deviceEntityIds[SensorTypes.PLANT_IMAGE_DEFAULT];
    if (defaultImageEntityId && hass.states[defaultImageEntityId]?.attributes.entity_picture) {
      return hass.states[defaultImageEntityId]?.attributes.entity_picture || '';
    }

    return '';
  };

  _handleEntities(deviceId, hass) {
    const deviceEntityIds = {
      [SensorTypes.PLANT_IMAGE_DEFAULT]: '',
      [SensorTypes.PLANT_IMAGE_USER]: '',
      [SensorTypes.SCIENTIFIC_NAME]: '',
      [SensorTypes.FERTILIZATION_LAST]: '',
      [SensorTypes.FERTILIZATION_NEXT]: '',
      [SensorTypes.BATTERY]: '',
      [SensorTypes.LIGHT]: '',
      [SensorTypes.LIGHT_STATE]: '',
      [SensorTypes.MOISTURE]: '',
      [SensorTypes.MOISTURE_STATE]: '',
      [SensorTypes.NUTRIENTS_STATE]: '',
      [SensorTypes.PLANT_STATE]: '',
      [SensorTypes.TEMPERATURE]: '',
      [SensorTypes.TEMPERATURE_STATE]: '',
    };

    Object.keys(hass.entities)
      .filter((entityId) => hass.entities[entityId].device_id === deviceId)
      .forEach((entityId) => {
        const hassState = hass.states[entityId];
        if (!hassState) return;

        const hassEntity = hass.entities[entityId];
        if (!hassEntity) return;

        if (entityId.startsWith(EntityType.IMAGE)) {
          if (hassEntity.translation_key === TranslationKeys.PLANT_IMAGE_USER) {
            deviceEntityIds[SensorTypes.PLANT_IMAGE_USER] = hassState.entity_id;
            return;
          }
          deviceEntityIds[SensorTypes.PLANT_IMAGE_DEFAULT] = hassState.entity_id;
          return;
        }

        if (entityId.startsWith(EntityType.SENSOR)) {
          switch (hassEntity.translation_key) {
            case TranslationKeys.LIGHT:
            case TranslationKeys.LIGHT_STATUS:
            case TranslationKeys.MOISTURE_STATUS:
            case TranslationKeys.NUTRIENTS_STATUS:
            case TranslationKeys.PLANT_STATUS:
            case TranslationKeys.SALINITY:
            case TranslationKeys.SALINITY_STATUS:
            case TranslationKeys.SCIENTIFIC_NAME:
            case TranslationKeys.TEMPERATURE_STATUS: {
              deviceEntityIds[hassEntity.translation_key] = hassState.entity_id;
              break;
            }

            case TranslationKeys.FERTILIZATION_LAST: {
              deviceEntityIds[SensorTypes.FERTILIZATION_LAST] = hassState.entity_id;
              break;
            }
            case TranslationKeys.FERTILIZATION_NEXT: {
              deviceEntityIds[SensorTypes.FERTILIZATION_NEXT] = hassState.entity_id;
              break;
            }

            default: {
              switch (hassState.attributes.device_class) {
                case DeviceClass.BATTERY:
                case DeviceClass.MOISTURE:
                case DeviceClass.TEMPERATURE: {
                  deviceEntityIds[hassState.attributes.device_class] = hassState.entity_id;
                  break;
                }
              }
            }
          }
        }
      });

    return deviceEntityIds;
  }

  static get styles() {
    return css`
      ha-card {
        position: relative;
        padding: 0;
        background-size: 100%;
      }

      img {
        display: block;
        height: auto;
        transition: filter .2s linear;
        width: 100%;
      }

      .content {
        padding-bottom: 8px;
      }

      .no-header {
        margin-top: 16px;
      }

      .header {
        height: 20px;
        margin: 0 16px 0 16px;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        --mdc-icon-size: 16px;
      }

      .device {
        display: flex;
        margin: 8px 16px 8px 16px;
      }

      .device #plant-image {
        width: 64px;
      }

      .device #plant-image > img {
        border-radius: 12px;
        width: 64px;
        height: 64px;
        object-fit: cover;
        box-shadow: var( --ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2) );
        cursor: pointer;
      }

      .device #plant-image > img.state {
        width: 60px;
        height: 60px;
        border-color: var(--disabled-text-color, #bdbdbd);
        border-width: 2px;
        border-style: solid;
      }

      .device #plant-text {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        margin-left: 16px;
        margin-right: 16px;
        height: 64px;
        justify-content: center;
        overflow: hidden;
      }

      .device #plant-text > #name {
        font-weight: bold;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        cursor: pointer;
      }

      .device #plant-text > #scientific-name {
        color: var(--secondary-text-color, #727272);
        text-wrap: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        cursor: pointer;
      }

      .device #plant-battery {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 16px;
        cursor: pointer;
        --mdc-icon-size: 16px;
      }

      .device #plant-measurements {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      .attribute {
        white-space: nowrap;
        display: flex;
        align-items: center;
        width: 16px;
        cursor: pointer;
        justify-content: center;
      }

      .meter {
        width: 8px;
        background-color: var(--primary-background-color, #fafafa);
        border-radius: 2px;
        display: inline-grid;
        overflow: hidden;
        height: 64px;
        align-items: end;
      }

      .meter > span {
        grid-row: 1;
        grid-column: 1;
        width: 100%;
        background-color: var(--primary-text-color, #212121);
        align-self: end;
      }

      .meter > .good {
        background-color: var(--green-color, #4caf50);
      }

      .meter > .bad {
        background-color: var(--red-color, #f44336);
      }

      .meter > .warning {
        background-color: var(--orange-color, #ff9800);
      }

      .meter > .unavailable {
        background-color: var(--grey-color, #9e9e9e);
      }

      .divider {
        height: 1px;
        background-color: var(--secondary-text-color, #727272);
        opacity: 0.25;
        margin-left: 8px;
        margin-right: 8px;
      }

      .tooltip {
        position: relative;
      }

      .tooltip .tip {
        opacity: 0;
        visibility: hidden;
        position: absolute;
        padding: 6px 10px;
        top: 3.3em;
        left: 50%;
        -webkit-transform: translateX(-50%) translateY(-180%);
        transform: translateX(-50%) translateY(-180%);
        background-color: var(--grey-color, #9e9e9e);
        color: var(--white-color, #ffffff);
        white-space: nowrap;
        z-index: 2;
        border-radius: 2px;
        transition: opacity 0.2s cubic-bezier(0.64, 0.09, 0.08, 1), transform 0.2s cubic-bezier(0.64, 0.09, 0.08, 1);
      }

      .battery.tooltip .tip {
        top: 2em;
      }

      .tooltip:hover .tip, .tooltip:active .tip {
        display: block;
        opacity: 1;
        visibility: visible;
        -webkit-transform: translateX(-50%) translateY(-200%);
        transform: translateX(-50%) translateY(-200%);
      }
    `;
  }

  _renderDevice(deviceId, hass) {
    const deviceEntityIds = this._handleEntities(deviceId, hass);

    return html`
      <div class="device" data-device-id="${deviceId}">
        <div id="plant-image">
          <img
            src="${this._getPlantImageSrc(hass, deviceEntityIds)}"
            class="${this.config.state_color_plant === PlantStateColorState.IMAGE ? 'state' : ''}"
            style="${this.config.state_color_plant === PlantStateColorState.IMAGE
              ? `border-color:${this._getStateColor(SensorTypes.PLANT_STATE, deviceEntityIds, hass)};`
              : ''}"
            @click="${this._click.bind(this, deviceEntityIds[SensorTypes.PLANT_STATE])}"
          >
        </div>
        <div id="plant-text">
          <span
            id="name"
            style="${this.config.state_color_plant === PlantStateColorState.NAME
              ? `color:${this._getStateColor(SensorTypes.PLANT_STATE, deviceEntityIds, hass)};`
              : ''}"
            @click=${this._click.bind(this, deviceEntityIds[SensorTypes.PLANT_STATE])}
          >
            ${hass.devices[deviceId]?.name}
          </span>
          ${this.config.show_scientific_name ? html`<span id="scientific-name" @click="${this._click.bind(this, deviceEntityIds[SensorTypes.PLANT_STATE])}">${hass.states[deviceEntityIds[SensorTypes.SCIENTIFIC_NAME]]?.state || ''}</span>`: ''}
        </div>
        ${this._renderBattery(hass, deviceEntityIds)}
        <div id="plant-measurements">
          ${this._renderSensors(hass, deviceEntityIds)}
        </div>
      </div>
    `;
  }

  _renderBattery(hass, deviceEntityIds) {
    const batteryEntityId = deviceEntityIds[SensorTypes.BATTERY];
    if (!batteryEntityId) {
      return nothing;
    }

    const batteryLevel = parseInt(hass.states[batteryEntityId].state);

    // Check against the user-configured threshold
    const threshold = this.config?.battery_threshold ?? DEFAULT_CONFIG.battery_threshold;

    // Only show battery if level is at or below the threshold
    // Skip showing if threshold is 0 (never show)
    if (threshold === 0 || batteryLevel > threshold) {
      return nothing;
    }

    const BatteryStatusText = {
      GOOD: 'Good',
      FULL: 'Full',
      MEDIUM: 'Medium',
      LOW: 'Low',
      VERY_LOW: 'Very Low',
      CRITICAL: 'Critical',
      UNKNOWN: 'Unknown',
    };

    const thresholdLevels = [
      { threshold: 91, icon: 'mdi:battery', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusText: BatteryStatusText.FULL },
      { threshold: 81, icon: 'mdi:battery-90', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusText: BatteryStatusText.GOOD },
      { threshold: 71, icon: 'mdi:battery-80', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusText: BatteryStatusText.GOOD },
      { threshold: 61, icon: 'mdi:battery-70', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusText: BatteryStatusText.GOOD },
      { threshold: 51, icon: 'mdi:battery-60', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusText: BatteryStatusText.GOOD },
      { threshold: 41, icon: 'mdi:battery-50', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusText: BatteryStatusText.MEDIUM },
      { threshold: 31, icon: 'mdi:battery-40', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusText: BatteryStatusText.MEDIUM },
      { threshold: 21, icon: 'mdi:battery-30', color: 'var(--state-sensor-battery-medium-color, #ff9800)', statusText: BatteryStatusText.LOW },
      { threshold: 11, icon: 'mdi:battery-20', color: 'var(--state-sensor-battery-medium-color, #ff9800)', statusText: BatteryStatusText.LOW },
      { threshold: 6, icon: 'mdi:battery-10', color: 'var(--state-sensor-battery-low-color, #f44336)', statusText: BatteryStatusText.VERY_LOW },
      { threshold: 0, icon: 'mdi:battery-alert', color: 'var(--state-sensor-battery-low-color, #f44336)', statusText: BatteryStatusText.CRITICAL },
      { threshold: -Infinity, icon: 'mdi:battery-alert-variant-outline', color: 'var(--state-sensor-battery-low-color, #f44336)', statusText: BatteryStatusText.UNKNOWN },
    ];

    const { icon, color, statusText } = thresholdLevels.find(({ threshold }) => batteryLevel >= threshold) || { icon: 'mdi:battery-alert-variant-outline', color: 'var(--red-color, #f44336)', statusText: BatteryStatusText.UNKNOWN };

    return html`
      <div id="plant-battery">
        <div class="battery tooltip" @click="${this._click.bind(this, batteryEntityId)}">
          <div class="tip" style="text-align:center;">Battery: ${batteryLevel}%<br>Status: ${statusText}</div>
          <ha-icon
            icon="${icon}"
            style="${this.config.state_color_battery
              ? `color: ${color};"`
              : ''}"
            ></ha-icon>
        </div>
      </div>
    `;
  }

  _calculateMeterState(sensorSettings, sensorState, statusState) {
    const MeterClass = {
      BAD: 'bad',
      GOOD: 'good',
      UNAVAILABLE: 'unavailable',
      WARNING: 'warning',
    };

    let percentage = null;
    if (sensorState !== null && sensorSettings.min !== null && sensorSettings.max != null) {
      const calculatedPercentage = (sensorState - sensorSettings.min) / (sensorSettings.max - sensorSettings.min) * 100;
      percentage = Math.max(0, Math.min(100, calculatedPercentage));
    }

    switch (statusState) {
      case MeasurementStatusStates.TOO_LOW: {
        return {
          percentage: percentage !== null ? percentage : 10,
          class: MeterClass.BAD,
        };
      }
      case MeasurementStatusStates.LOW: {
        return {
          percentage: percentage !== null ? percentage : 30,
          class: MeterClass.WARNING,
        };
      }
      case MeasurementStatusStates.PERFECT: {
        return {
          percentage: percentage !== null ? percentage : 50,
          class: MeterClass.GOOD,
        };
      }
      case MeasurementStatusStates.HIGH: {
        return {
          percentage: percentage !== null ? percentage : 70,
          class: MeterClass.WARNING,
        };
      }
      case MeasurementStatusStates.TOO_HIGH: {
        return {
          percentage: percentage !== null ? percentage : 90,
          class: MeterClass.BAD,
        };
      }
      default: {
        return { percentage: 0, class: MeterClass.UNAVAILABLE };
      }
    }
  }

  _buildNutritionTooltipContent(statusState, daysUntilFertilization, lastFertilizationDateString, nextFertilizationDateString) {
    const nutritionStatus = statusState.replace(/_/g, ' ');
    const showFertilization = daysUntilFertilization !== null && !isNaN(daysUntilFertilization);

    let fertilizationLine = nothing;
    if (showFertilization) {
      const daysText = Math.abs(daysUntilFertilization) === 1 ? 'day' : 'days';
      fertilizationLine = daysUntilFertilization >= 0
        ? html`<br>Fertilize in ${daysUntilFertilization} ${daysText}`
        : html`<br>Fertilization overdue by ${Math.abs(daysUntilFertilization)} ${daysText}`;
    }

    const lastFertilizationLine = lastFertilizationDateString
      ? html`<br>Last Fertilization: ${this._formatDateForDisplay(lastFertilizationDateString)}`
      : nothing;

    const nextFertilizationLine = nextFertilizationDateString
      ? html`<br>Next Fertilization: ${this._formatDateForDisplay(nextFertilizationDateString)}`
      : nothing;

    return html`Nutrition Status: ${nutritionStatus}${fertilizationLine}${lastFertilizationLine}${nextFertilizationLine}`;
  }

  _renderSensors(hass, deviceEntityIds) {
    // Filter enabled sensors based on entity ID availability
    const visibleSensors = this.config.sensors?.filter((sensorSettings) => {
      return sensorSettings && sensorSettings.isEnabled && deviceEntityIds[sensorSettings.type] !== '';
    });

    if (!visibleSensors || visibleSensors.length === 0) {
      return nothing;
    }

    const renderSensor = (sensorType) => {
      if (sensorType === SensorTypes.NUTRIENTS) {
        return renderSensorNutrition();
      }

      const sensorSettings = SENSOR_SETTINGS[sensorType];
      const sensorEntityId = deviceEntityIds[sensorType];
      const sensorValue = hass.states[sensorEntityId].state;
      const formattedSensorValue = this.config.decimals === false ? sensorValue : this._formatDecimals(sensorValue, this.config.decimals);

      // Get proper units for display and tooltip
      const unitOfMeasurement = hass.states[sensorEntityId].attributes.unit_of_measurement || '';

      const mapSensorStatusType = (sensorType) => {
        switch (sensorType) {
          case SensorTypes.LIGHT: {
            return SensorTypes.LIGHT_STATE;
          }
          case SensorTypes.MOISTURE: {
            return SensorTypes.MOISTURE_STATE;
          }
          case SensorTypes.TEMPERATURE: {
            return SensorTypes.TEMPERATURE_STATE;
          }
          case SensorTypes.SALINITY: {
            return SensorTypes.SALINITY_STATE;
          }
          default: {
            throw new Error(`Unsupported sensor type: ${sensorType}`);
          }
        }
      };

      // Get the proper status entity
      let sensorStatus = '';

      const statusEntityId = deviceEntityIds[mapSensorStatusType(sensorType)];
      if (statusEntityId) {
        sensorStatus = hass.states[statusEntityId].state;
      }

      // Calculate meter width and class based on status
      const meterState = this._calculateMeterState(sensorSettings, sensorValue, sensorStatus);

      // Generate tooltip content with current value and status - use full unit
      const tooltipContent = html`${sensorSettings.name}: ${formattedSensorValue} ${unitOfMeasurement}${sensorStatus ? html`<br>Status: ${sensorStatus.replace(/_/g, ' ')}` : nothing}`;

      return html`
        <div class="attribute tooltip" @click=${this._click.bind(this, sensorEntityId)} data-entity="${sensorEntityId}">
          <div class="tip" style="text-align:center;">${tooltipContent}</div>
          <div class="meter">
            <span
              class=${this.config.state_color_sensor ? meterState.class : ''}
              style="height: ${meterState.percentage}%;">
            </span>
          </div>
        </div>
      `;
    };

    // Render nutrition status
    const renderSensorNutrition = () => {
      const statusEntityId = deviceEntityIds[SensorTypes.NUTRIENTS_STATE];
      const sensorState = hass.states[statusEntityId]?.state;

      // Get fertilizations date if available
      const fertiliseLastEntityId = deviceEntityIds[SensorTypes.FERTILIZATION_LAST];
      const fertiliseNextEntityId = deviceEntityIds[SensorTypes.FERTILIZATION_NEXT];
      let daysUntilFertilization = null;
      let lastFertilizationDateString = null;
      let nextFertilizationDateString = null;

      if (fertiliseNextEntityId && hass.states[fertiliseNextEntityId]) {
        nextFertilizationDateString = hass.states[fertiliseNextEntityId].state;
        daysUntilFertilization = this._calculateDaysFromNow(nextFertilizationDateString);
      }

      if (fertiliseLastEntityId && hass.states[fertiliseLastEntityId]) {
        lastFertilizationDateString = hass.states[fertiliseLastEntityId].state;
      }

      // Format the next fertilization date for display
      const meterState = this._calculateMeterState(SENSOR_SETTINGS[SensorTypes.NUTRIENTS], null, sensorState);

      // Build tooltip content
      const tooltipContent = this._buildNutritionTooltipContent(sensorState, daysUntilFertilization, lastFertilizationDateString, nextFertilizationDateString);

      return html`
        <div class="attribute tooltip" @click=${this._click.bind(this, statusEntityId)} data-entity="${statusEntityId}">
          <div class="tip" style="text-align:center;">${tooltipContent}</div>
          <div class="meter">
            <span
              class=${this.config.state_color_sensor ? meterState.class : ''}
              style="height: ${meterState.percentage}%;">
            </span>
          </div>
        </div>
      `;
    };

    return visibleSensors.map((sensorSettings) => {
      return html`${renderSensor(sensorSettings.type)}`;
    });
  }
}

customElements.define(CUSTOM_CARD_NAME, FytaGardenCard);

export class FytaGardenCardEditor extends LitElement {
  static properties = {
    hass: { type: Object },
    config: { state: true },
  };

  constructor() {
    super();
    this._configDeviceIds = [];
  }

  _addDevice(event) {
    console.debug('Add device:', JSON.stringify(event), event);

    const deviceId = event.detail.value;
    if (deviceId === '') return;

    const newDevices = this.config.device_ids.concat(deviceId).filter((deviceId) => deviceId);
    const config = { ...this.config, device_ids: newDevices };
    this._configDeviceIds = newDevices;

    event.target.value = ''; // Clear the input field after adding

    this._configChanged(config);
  }

  _computeLabel(schema) {
    // The schema already has labels, but for grids we need this function
    // to ensure proper display of field names
    return schema.label || schema.name;
  }

  _configChanged(config) {
    console.debug('Config changed:', config);
    const event = new Event('config-changed', {
      bubbles: true,
      composed: true,
    });
    event.detail = { config };
    this.dispatchEvent(event);
  }

  _deviceChange(event) {
    console.debug('Device change:', JSON.stringify(event), event);
    // TODO: Implement
    const newConfig = { ...this.config };
    this._configChanged(newConfig);
  }

  _deviceFilter(device) {
    // Filter devices to only include those from the FYTA manufacturer
    return device.manufacturer?.toLowerCase() === 'fyta';
  }

  _deviceMoved(event) {
    console.debug('Device moved:', JSON.stringify(event), event);
    event.stopPropagation();

    const { oldIndex, newIndex } = event.detail;

    const newDevices = this.config.device_ids.concat();
    newDevices.splice(newIndex, 0, newDevices.splice(oldIndex, 1)[0]);

    const newConfig = { ...this.config, device_ids: newDevices };
    this._configDeviceIds = newDevices;

    this._configChanged(newConfig);
  }

  _sensorChange(event) {
    console.debug('Sensor change:', JSON.stringify(event), event);
    const item = event.currentTarget.closest('.item');
    const sensorType = item.getAttribute('data-sensor-type');

    let newConfig = { ...this.config };

    let configSensors = newConfig.sensors || DEFAULT_CONFIG.sensors;
    // Update the config with the new value
    configSensors = configSensors.map((sensorSettings) => {
      if (sensorSettings.type === sensorType) {
        return { ...sensorSettings, isEnabled: event.target.checked };
      }
      return sensorSettings;
    });

    // Enable default sensors if none are enabled
    if (configSensors.reduce((accumulator, item) => accumulator + (item.isEnabled ? 1 : 0), 0) === 0) {
      configSensors = configSensors.map(({ type }) => {
         return DEFAULT_CONFIG.sensors.find((defaultSensorSettings) => defaultSensorSettings.type === type);
      });
    }

    newConfig.sensors = configSensors;

    this._configChanged(newConfig);
  } 

  _sensorMoved(event) {
    console.debug('Sensor moved:', JSON.stringify(event), event);
    event.stopPropagation();

    const { oldIndex, newIndex } = event.detail;

    const newItems = this.config.sensors.concat();
    newItems.splice(newIndex, 0, newItems.splice(oldIndex, 1)[0]);

    const newConfig = { ...this.config, sensors: newItems };

    this._configChanged(newConfig);
  }

  _valueChanged(event) {
    console.debug('Value changed:', JSON.stringify(event), event);
    if (!this.config || !this.hass) {
      return;
    }

    // Start with a fresh object with the old values
    const newConfig = { ...this.config };

    if (event.detail?.value) {
      Object.keys(event.detail.value).forEach((key) => {
        newConfig[key] = event.detail.value[key];
      });
    }

    this._configChanged(newConfig);
  }

  _getSensorColor(sensorType, isEnabled) {
    if (!isEnabled) {
      return 'var(--disabled-color, #bdbdbd)';
    }

    switch (sensorType) {
      case SensorTypes.LIGHT: {
        return 'var(--yellow-color, #ffeb3b)';
      }
      case SensorTypes.MOISTURE: {
        return 'var(--blue-color, #2196f3)';
      }
      case SensorTypes.TEMPERATURE: {
        return 'var(--green-color, #4caf50)';
      }
      case SensorTypes.NUTRIENTS: {
        return 'var(--brown-color, #795548)';
      }
      case SensorTypes.SALINITY: {
        return 'var(--purple-color, #9c27b0)';
      }
      default: {
        return 'var(--disabled-color: #bdbdbd;)';
      }
    }
  }

  render() {
    if (!this.hass || !this.config) {
      return nothing;
    }

    return html`
      <div class="card-config">
        <div class="side-by-side">
          <ha-form
            .hass=${this.hass}
            .data=${this.config}
            .schema=${SCHEMA_PART_ONE}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._valueChanged}
          ></ha-form>
          <ha-sortable
            handle-selector=".handle"
            @item-moved=${this._deviceMoved}
          >
            <div class="devices">
              ${this._configDeviceIds.map((deviceId) => {
                return deviceId
                  ? html`
                    <div class="item" data-device-id="${deviceId}">
                      <div class="handle">
                        <ha-icon icon="mdi:drag"></ha-svg-icon>
                      </div>
                      <ha-device-picker
                        class="device-picker"
                        .hass=${this.hass}
                        .value=${deviceId}
                        .placeholder=${'Select a FYTA device'}
                        .deviceFilter=${this._deviceFilter}
                        .includeDomains=${['sensor', 'image']}
                        .excludeDevices=${this._configDeviceIds}
                        @value-changed=${this._deviceChange}
                      ></ha-device-picker>
                    </div>`
                  : nothing;
              })}
            </div>
          </ha-sortable>
          <ha-device-picker
            class="add-device"
            .hass=${this.hass}
            .placeholder=${'Select a FYTA device'}
            .deviceFilter=${this._deviceFilter}
            .includeDomains=${['sensor', 'image']}
            .excludeDevices=${this._configDeviceIds}
            @value-changed=${this._addDevice}
          ></ha-device-picker>

          <ha-form
            .hass=${this.hass}
            .data=${this.config}
            .schema=${SCHEMA_PART_TWO}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._valueChanged}
          ></ha-form>
          <ha-sortable
            handle-selector=".handle"
            @item-moved=${this._sensorMoved}
          >
            <div class="sensors">
              ${this.config?.sensors.map(({type, isEnabled}) => html`
                <div class="item item-sensor" data-sensor-type="${type}">
                  <div class="handle">
                    <ha-icon icon="mdi:drag"></ha-svg-icon>
                  </div>
                  <div class="item-switch">
                    <ha-switch
                      .checked=${isEnabled}
                      @change=${this._sensorChange}
                    ></ha-switch>
                  </div>
                  <div class="item-icon">
                    <ha-icon
                      icon="${SENSOR_SETTINGS[type].icon}"
                      style="color:${this._getSensorColor(type, isEnabled)}"></ha-svg-icon>
                  </div>
                  <div class="item-label">${SENSOR_SETTINGS[type].name}</div>
                </div>
              `
              )}
            </div>
          </ha-sortable>
          <ha-form
            .hass=${this.hass}
            .data=${this.config}
            .schema=${SCHEMA_PART_THREE}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .add-device {
        display: block;
        margin: 8px 0 24px 31px;
        margin-inline-start: 31px;
        margin-inline-end: initial;
        direction: var(--direction);
      }
      .item {
        display: flex;
        margin-top: 8px;
        align-items: center;
      }
      .item-sensor {
        padding: 8px;
      }
      .item .handle {
        padding-right: 16px;
        cursor: move;
        cursor: grab;
        padding-inline-start: initial;
        padding-inline-end: 8px;
        direction: var(--direction);
      }
      .item .handle > * {
        pointer-events: none;
      }
      .item .item-switch, .item .item-icon {
        padding-right: 16px;
      }
      .item .item-label {
        flex-grow: 1;
      }
      .item .device-picker {
        flex-grow: 1;
      }
      .sensors {
        margin-bottom: 12px;
      }
    `;
  }

  setConfig(config) {
    // Start with a fresh object with all defaults set
    const newConfig = parseConfig(config);
    this.config = newConfig;
    this._configDeviceIds = newConfig.device_ids.filter((deviceId) => deviceId);

    this.requestUpdate();
  }
}

customElements.define(`${CUSTOM_CARD_NAME}-editor`, FytaGardenCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: CUSTOM_CARD_NAME,
  name: 'FYTA Garden Card',
  preview: true,
  description: 'Custom card for your FYTA garden data',
});
