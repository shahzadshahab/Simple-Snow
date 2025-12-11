<?php
/*
Plugin Name: Simple Snow
Plugin URI:  https://creatingbee.com/plugins/simple-snow
Description: Lightweight, elegant snowfall effect on the front-end. No settings page.
Version:     1.0
Author:      Shahzad Shahab
License:     GPLv2 or later
Text Domain: simple-snow
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register settings
 */
function wpss_register_settings() {
	register_setting(
		'wpss_settings_group',
		'wpss_background_mode',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'wpss_sanitize_mode',
			'default'           => 'dark',
		)
	);
}
add_action( 'admin_init', 'wpss_register_settings' );

/**
 * Sanitize mode
 */
function wpss_sanitize_mode( $value ) {
	return ( $value === 'light' ) ? 'light' : 'dark';
}

/**
 * Add settings page
 */
function wpss_add_settings_menu() {
	add_options_page(
		__( 'Simple Snow', 'simple-snow' ),
		__( 'Simple Snow', 'simple-snow' ),
		'manage_options',
		'wpss-settings',
		'wpss_settings_page'
	);
}
add_action( 'admin_menu', 'wpss_add_settings_menu' );

/**
 * Settings page view
 */
function wpss_settings_page() {

	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$mode = get_option( 'wpss_background_mode', 'dark' );

	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Simple Snow', 'simple-snow' ); ?></h1>

		<form method="post" action="options.php">
			<?php settings_fields( 'wpss_settings_group' ); ?>

			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<label><?php esc_html_e( 'Snow Visibility Mode', 'simple-snow' ); ?></label>
					</th>
					<td>
						<fieldset>
							<label>
								<input type="radio" name="wpss_background_mode" value="dark" <?php checked( $mode, 'dark' ); ?> />
								<?php esc_html_e( 'Dark Background (default)', 'simple-snow' ); ?>
							</label>
							<br>

							<label>
								<input type="radio" name="wpss_background_mode" value="light" <?php checked( $mode, 'light' ); ?> />
								<?php esc_html_e( 'Light Background', 'simple-snow' ); ?>
							</label>
						</fieldset>
					</td>
				</tr>
			</table>

			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}

/**
 * Enqueue snow script
 */
function wpss_enqueue_scripts() {

	$mode = get_option( 'wpss_background_mode', 'dark' );

	wp_enqueue_script(
		'wpss-snow-js',
		plugin_dir_url( __FILE__ ) . 'assets/snow.js',
		array(),
		'1.4',
		true
	);

	wp_localize_script(
		'wpss-snow-js',
		'wpssSnowSettings',
		array(
			'mode' => $mode,
		)
	);
}
add_action( 'wp_enqueue_scripts', 'wpss_enqueue_scripts' );