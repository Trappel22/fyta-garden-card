# Home Assistant FYTA Garden Card

A custom card for displaying the data of one or more [FYTA plants](https://fyta.de/) on a [Home Assistant](https://www.home-assistant.io/) dashboard.

## Prerequisites

- [FYTA integration](https://www.home-assistant.io/integrations/fyta/) must be installed and configured in Home Assistant.

## Features

- Displays plant image, name, and health status
- Shows sensor values with color-coded meter bars
- Customizable sensor selection and order (moisture, light, temperature, nutrition, salinity)
- Interactive elements - click any sensor to view detailed data
- Battery status indicator with configurable threshold

## Installation

### HACS Installation (Recommended)

1. Add this repository as a custom repository in HACS:
   - Go to HACS → Frontend
   - Click the three dots in the top right corner
   - Select "Custom repositories"
   - Add `https://github.com/gregor/fyta-garden-card` with category "Dashboard"
2. Install latest version of "FYTA Garden Card" from HACS
3. Refresh your browser

### Manual Installation

1. Download `fyta-garden-card.js` from the `dist` folder in this repository
2. Copy it to your `config/www` directory
3. Add the resource in your dashboard:
   - Go to your dashboard
   - Click "Edit Dashboard" → "Manage Resources"
   - Add `/local/fyta-garden-card.js` as a JavaScript module
4. Refresh your browser

## Configuration

The card includes a visual editor for easy configuration. For manual YAML configuration, use these options:

| Name                 | Type     | Description                                          | Default      |
|----------------------|----------|------------------------------------------------------|--------------|
| type                 | string   | `custom:fyta-garden-card`                            | (required)   |
| battery_threshold    | number   | Battery level (%) at which icon appears (0-100)      | `30`         |
| decimals             | enum     | `false` or any integer value: Sensor value precision | `30`         |
| device_ids           | string[] | Array of device ID of the FYTA plants                | (required)   |
| preferred_image      | string   | `user` or `default`                                  | `user`       |
| sensor               | object[] | Array of sensor settings.                            | See sensors  |
| show_scientific_name | boolean  | Show scientific name of plant                        | `true`       |
| state_color_battery  | boolean  | Expose battery state in color of battery icon        | `true`       |
| state_color_plant    | string   | `image`, `name`, or `disabled`                       | `image`      |
| state_color_sensor   | boolean  | Expose sensor state in color of sensor bars          | `true`       |
| title                | string   | Optional card title                                  | ''           |

### Sensors
Sensors is a YAML array that set the order of sensors and whether they are enabled. Each entry consists of a type (`light`, `moisture`, `temperature`, `salinity`, or `nutrients`) and its state `isEnabled`.

### Battery Display

Set `battery_threshold` to control when the battery icon appears:
- `0`: Never show the battery icon
- `30` (default): Show only when battery is 30% or below
- `100`: Always show the battery icon
- Any value in between: Show when battery level is at or below this percentage

## Example Configuration

```yaml
type: custom:fyta-garden-card
battery_threshold: 35
decimals: 0
device_ids:
  - 93a585954501320a86a1ede002d91f7a
  - 15a314d2c9e80c968ecfddc597a557d6
  - 24804cee9db1a8c5c397ca03c8d15d09
  - e4b7a5c80404ac5792bf8d2eaa01371a
  - 15a314d2c9e80c968ecfddc597a357d6
preferred_image: user
sensors:
  - type: light
    isEnabled: true
  - type: temperature
    isEnabled: true
  - type: moisture
    isEnabled: true
  - type: nutrients
    isEnabled: false
  - type: salinity
    isEnabled: false
show_scientific_name: false
state_color_battery: true
state_color_plant: image
state_color_sensor: true
title: Hortus Muri
```

## Troubleshooting

- Make sure your FYTA integration is properly set up with connected plants
- Verify your plant's device ID is correct
- Check browser console for any error messages
- If card does not appear after installation, clear your browser cache

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0).
