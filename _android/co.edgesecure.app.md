---
wsId: edge
title: Edge - Bitcoin & Crypto Wallet
altTitle: 
authors:
- leo
- emanuel
- danny
- keraliss
users: 500000
appId: co.edgesecure.app
appCountry: 
released: 2018-03-01
updated: 2024-10-17
version: 4.15.0
stars: 4.1
ratings: 3880
reviews: 669
size: 
website: https://edge.app
repository: https://github.com/EdgeApp/edge-react-gui
issue: https://github.com/EdgeApp/edge-react-gui/issues/1748
icon: co.edgesecure.app.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-09-10
signer: 8cd6a12e3dc595964fabcbe82341e28f4a2a4ac6a347fcbead488b76faa7e186
reviewArchive:
- date: 2023-07-26
  version: 4.8.0
  appHash: 
  gitRevision: 3703a5d0543f672252f7b37e5636a9e40c3b6e5e
  verdict: nonverifiable
- date: 2023-10-31
  version: 3.2.0
  appHash: 
  gitRevision: bc81fe15c5fe7520ba3836d58de315d288559d27
  verdict: nonverifiable
- date: 2022-11-02
  version: 2.25.0
  appHash: 
  gitRevision: 40f08fdf8b2ed3762dba004a2500fa19b5a5eb02
  verdict: ftbfs
- date: 2022-03-13
  version: 2.12.0
  appHash: 
  gitRevision: 26a46f55d9739ede4c8b778ac3ae1ce6c91995b9
  verdict: ftbfs
- date: 2019-11-10
  version: 1.10.1
  appHash: 
  gitRevision: 1707808e9efc2ab4ea3a03510ebd408811586d47
  verdict: nonverifiable
twitter: edgewallet
social:
- https://www.linkedin.com/company/edgeapp
- https://www.reddit.com/r/EdgeWallet
redirect_from:
- /edge/
- /co.edgesecure.app/
- /posts/2019/11/edge/
- /posts/co.edgesecure.app/
developerName: Edge (formerly Airbitz)
features: 

---

**Update 2024-09-10:**

**Review: EdgeSecure Wallet Build**

The build process for the EdgeSecure Wallet was completed successfully using the provided Dockerfile. The APK was generated without any errors. However, a comparison between the generated APK and the official APK revealed some differences.

**Command Used:**
```
 docker build -t edgesecure -f edge.dockerfile .
```

**Differences Noted:**
A recursive diff comparison between the generated APK and the official APK showed these differences:
```
keraliss@keraliss:~/projects/walletScrutiny_build/edgesecure$ diff --recursive from*
Binary files fromBuild/AndroidManifest.xml and fromOfficial/AndroidManifest.xml differ
Only in fromOfficial: androidx
Only in fromBuild/assets: app.config
Only in fromBuild/assets: blank.html
Only in fromBuild/assets: co.electriccoin.zcash
Binary files fromBuild/assets/dexopt/baseline.prof and fromOfficial/assets/dexopt/baseline.prof differ
Binary files fromBuild/assets/dexopt/baseline.profm and fromOfficial/assets/dexopt/baseline.profm differ
Only in fromBuild/assets: edge-core
Only in fromBuild/assets: edge-core-js
Only in fromBuild/assets: edge-currency-accountbased
Only in fromBuild/assets: edge-currency-plugins
Only in fromBuild/assets: edge-exchange-plugins
Only in fromOfficial/assets: flutter_assets
Only in fromBuild/assets: fonts
Only in fromOfficial/assets: hrtfs
Only in fromBuild/assets: index.android.bundle
Only in fromOfficial/assets: lua
Only in fromBuild/assets: piratesaplingtree
Only in fromBuild/assets: sentry-debug-meta.properties
Only in fromBuild/assets: sentry-external-modules.txt
Only in fromOfficial: build-data.properties
Only in fromBuild: classes2.dex
Only in fromBuild: classes3.dex
Only in fromBuild: classes4.dex
Only in fromBuild: classes5.dex
Binary files fromBuild/classes.dex and fromOfficial/classes.dex differ
Only in fromBuild: client_analytics.proto
Only in fromBuild: compact_formats.proto
Only in fromBuild: core-common.properties
Only in fromBuild: darkside.proto
Binary files fromBuild/DebugProbesKt.bin and fromOfficial/DebugProbesKt.bin differ
Only in fromBuild: firebase-annotations.properties
Only in fromBuild: firebase-encoders-json.properties
Only in fromBuild: firebase-encoders.properties
Only in fromBuild: firebase-encoders-proto.properties
Only in fromBuild: firebase-iid-interop.properties
Only in fromBuild: firebase-measurement-connector.properties
Only in fromBuild: google
Only in fromOfficial: junit
diff --recursive fromBuild/kotlin-tooling-metadata.json fromOfficial/kotlin-tooling-metadata.json
4c4
<   "buildSystemVersion": "7.5.1",
---
>   "buildSystemVersion": "7.5",
6c6
<   "buildPluginVersion": "1.8.22",
---
>   "buildPluginVersion": "1.9.23",
Only in fromBuild: lib
Only in fromOfficial: LICENSE-junit.txt
Only in fromBuild: messaging_event_extension.proto
Only in fromBuild: messaging_event.proto
Only in fromBuild/META-INF: androidx.activity_activity-ktx.version
diff --recursive fromBuild/META-INF/androidx.activity_activity.version fromOfficial/META-INF/androidx.activity_activity.version
1c1
< 1.6.0
---
> 1.7.2
Only in fromBuild/META-INF: androidx.autofill_autofill.version
Only in fromOfficial/META-INF: androidx.biometric_biometric.version
diff --recursive fromBuild/META-INF/androidx.browser_browser.version fromOfficial/META-INF/androidx.browser_browser.version
1c1
< 1.0.0
---
> task ':browser:browser:writeVersionFile' property 'version'
Only in fromBuild/META-INF: androidx.cardview_cardview.version
diff --recursive fromBuild/META-INF/androidx.coordinatorlayout_coordinatorlayout.version fromOfficial/META-INF/androidx.coordinatorlayout_coordinatorlayout.version
1c1
< 1.2.0
---
> 1.0.0
diff --recursive fromBuild/META-INF/androidx.core_core-ktx.version fromOfficial/META-INF/androidx.core_core-ktx.version
1c1
< 1.9.0
---
> 1.12.0
diff --recursive fromBuild/META-INF/androidx.core_core-splashscreen.version fromOfficial/META-INF/androidx.core_core-splashscreen.version
1c1
< 1.0.0
---
> 1.0.1
diff --recursive fromBuild/META-INF/androidx.core_core.version fromOfficial/META-INF/androidx.core_core.version
1c1
< 1.9.0
---
> 1.12.0
diff --recursive fromBuild/META-INF/androidx.customview_customview.version fromOfficial/META-INF/androidx.customview_customview.version
1c1
< 1.1.0
---
> 1.0.0
Only in fromOfficial/META-INF: androidx.databinding_viewbinding.version
diff --recursive fromBuild/META-INF/androidx.documentfile_documentfile.version fromOfficial/META-INF/androidx.documentfile_documentfile.version
1c1
< 1.0.1
---
> 1.0.0
diff --recursive fromBuild/META-INF/androidx.drawerlayout_drawerlayout.version fromOfficial/META-INF/androidx.drawerlayout_drawerlayout.version
1c1
< 1.1.1
---
> 1.0.0
Only in fromBuild/META-INF: androidx.dynamicanimation_dynamicanimation-ktx.version
Only in fromBuild/META-INF: androidx.dynamicanimation_dynamicanimation.version
Only in fromBuild/META-INF: androidx.exifinterface_exifinterface.version
Only in fromBuild/META-INF: androidx.fragment_fragment-ktx.version
diff --recursive fromBuild/META-INF/androidx.fragment_fragment.version fromOfficial/META-INF/androidx.fragment_fragment.version
1c1
< 1.5.7
---
> 1.6.2
Only in fromBuild/META-INF: androidx.lifecycle_lifecycle-livedata-core-ktx.version
Only in fromBuild/META-INF: androidx.lifecycle_lifecycle-runtime-ktx.version
Only in fromBuild/META-INF: androidx.lifecycle_lifecycle-service.version
Only in fromBuild/META-INF: androidx.lifecycle_lifecycle-viewmodel-ktx.version
diff --recursive fromBuild/META-INF/androidx.loader_loader.version fromOfficial/META-INF/androidx.loader_loader.version
1c1
< 1.1.0
---
> 1.0.0
diff --recursive fromBuild/META-INF/androidx.media_media.version fromOfficial/META-INF/androidx.media_media.version
1c1
< 1.0.0
---
> 1.1.0
Only in fromBuild/META-INF: androidx.paging_paging-runtime-ktx.version
Only in fromBuild/META-INF: androidx.paging_paging-runtime.version
Only in fromBuild/META-INF: androidx.palette_palette.version
Only in fromBuild/META-INF: androidx.recyclerview_recyclerview.version
Only in fromBuild/META-INF: androidx.room_room-runtime.version
Only in fromBuild/META-INF: androidx.savedstate_savedstate-ktx.version
Only in fromOfficial/META-INF: androidx.security_security-crypto.version
Only in fromBuild/META-INF: androidx.sqlite_sqlite-framework.version
Only in fromBuild/META-INF: androidx.sqlite_sqlite-ktx.version
Only in fromBuild/META-INF: androidx.sqlite_sqlite.version
diff --recursive fromBuild/META-INF/androidx.swiperefreshlayout_swiperefreshlayout.version fromOfficial/META-INF/androidx.swiperefreshlayout_swiperefreshlayout.version
1c1
< 1.1.0
---
> 1.0.0
diff --recursive fromBuild/META-INF/androidx.tracing_tracing.version fromOfficial/META-INF/androidx.tracing_tracing.version
1c1
< 1.3.0-alpha02
---
> 1.0.0
Only in fromBuild/META-INF: androidx.transition_transition.version
Only in fromBuild/META-INF: androidx.viewpager2_viewpager2.version
Only in fromBuild/META-INF: androidx.webkit_webkit.version
Only in fromOfficial/META-INF: androidx.window_window-java.version
Only in fromOfficial/META-INF: androidx.window_window.version
Only in fromBuild/META-INF: androidx.work_work-runtime.version
diff --recursive fromBuild/META-INF/com/android/build/gradle/app-metadata.properties fromOfficial/META-INF/com/android/build/gradle/app-metadata.properties
2c2
< androidGradlePluginVersion=7.4.1
---
> androidGradlePluginVersion=7.4.2
Only in fromBuild/META-INF: com.google.android.material_material.version
Only in fromOfficial/META-INF: com.google.dagger_dagger.version
diff --recursive fromBuild/META-INF/kotlinx_coroutines_android.version fromOfficial/META-INF/kotlinx_coroutines_android.version
1c1
< 1.7.3
\ No newline at end of file
---
> 1.6.4
\ No newline at end of file
diff --recursive fromBuild/META-INF/kotlinx_coroutines_core.version fromOfficial/META-INF/kotlinx_coroutines_core.version
1c1
< 1.7.3
\ No newline at end of file
---
> 1.6.4
\ No newline at end of file
Only in fromBuild/META-INF: kotlinx_coroutines_play_services.version
Only in fromBuild/META-INF: native-image
Only in fromOfficial/META-INF/services: c7.f
Only in fromOfficial/META-INF/services: d8.d0
Only in fromBuild/META-INF/services: io.grpc.LoadBalancerProvider
Only in fromBuild/META-INF/services: io.grpc.ManagedChannelProvider
Only in fromBuild/META-INF/services: io.grpc.NameResolverProvider
Only in fromBuild/META-INF/services: io.grpc.ServerProvider
Only in fromBuild/META-INF/services: kotlin.reflect.jvm.internal.impl.builtins.BuiltInsLoader
Only in fromBuild/META-INF/services: kotlin.reflect.jvm.internal.impl.resolve.ExternalOverridabilityCondition
Only in fromBuild/META-INF/services: kotlinx.coroutines.CoroutineExceptionHandler
Only in fromBuild/META-INF/services: kotlinx.coroutines.internal.MainDispatcherFactory
Only in fromOfficial/META-INF/services: kotlinx.coroutines.internal.r
Only in fromOfficial/META-INF/services: w5.a
Only in fromBuild: okhttp3
Only in fromBuild: org
Only in fromBuild: play-services-auth-api-phone.properties
Only in fromBuild: play-services-auth-base.properties
Only in fromBuild: play-services-auth.properties
Only in fromBuild: play-services-basement.properties
Only in fromBuild: play-services-base.properties
Only in fromBuild: play-services-clearcut.properties
Only in fromBuild: play-services-cloud-messaging.properties
Only in fromBuild: play-services-fido.properties
Only in fromBuild: play-services-flags.properties
Only in fromBuild: play-services-iid.properties
Only in fromBuild: play-services-phenotype.properties
Only in fromBuild: play-services-stats.properties
Only in fromBuild: play-services-tasks.properties
Only in fromBuild: play-services-vision-common.properties
Only in fromBuild: play-services-vision.properties
Only in fromBuild: proposal.proto
Binary files fromBuild/res/anim/abc_fade_in.xml and fromOfficial/res/anim/abc_fade_in.xml differ
Binary files fromBuild/res/anim/abc_fade_out.xml and fromOfficial/res/anim/abc_fade_out.xml differ
Binary files fromBuild/res/anim/abc_grow_fade_in_from_bottom.xml and fromOfficial/res/anim/abc_grow_fade_in_from_bottom.xml differ
Binary files fromBuild/res/anim/abc_popup_enter.xml and fromOfficial/res/anim/abc_popup_enter.xml differ
Binary files fromBuild/res/anim/abc_popup_exit.xml and fromOfficial/res/anim/abc_popup_exit.xml differ
Binary files fromBuild/res/anim/abc_shrink_fade_out_from_bottom.xml and fromOfficial/res/anim/abc_shrink_fade_out_from_bottom.xml differ
Binary files fromBuild/res/anim/abc_slide_in_bottom.xml and fromOfficial/res/anim/abc_slide_in_bottom.xml differ
Binary files fromBuild/res/anim/abc_slide_in_top.xml and fromOfficial/res/anim/abc_slide_in_top.xml differ
Binary files fromBuild/res/anim/abc_slide_out_bottom.xml and fromOfficial/res/anim/abc_slide_out_bottom.xml differ
Binary files fromBuild/res/anim/abc_slide_out_top.xml and fromOfficial/res/anim/abc_slide_out_top.xml differ
Binary files fromBuild/res/anim/abc_tooltip_enter.xml and fromOfficial/res/anim/abc_tooltip_enter.xml differ
Binary files fromBuild/res/anim/abc_tooltip_exit.xml and fromOfficial/res/anim/abc_tooltip_exit.xml differ
Binary files fromBuild/res/anim/btn_checkbox_to_checked_box_inner_merged_animation.xml and fromOfficial/res/anim/btn_checkbox_to_checked_box_inner_merged_animation.xml differ
Binary files fromBuild/res/anim/btn_checkbox_to_checked_box_outer_merged_animation.xml and fromOfficial/res/anim/btn_checkbox_to_checked_box_outer_merged_animation.xml differ
Binary files fromBuild/res/anim/btn_checkbox_to_checked_icon_null_animation.xml and fromOfficial/res/anim/btn_checkbox_to_checked_icon_null_animation.xml differ
Binary files fromBuild/res/anim/btn_checkbox_to_unchecked_box_inner_merged_animation.xml and fromOfficial/res/anim/btn_checkbox_to_unchecked_box_inner_merged_animation.xml differ
Binary files fromBuild/res/anim/btn_checkbox_to_unchecked_check_path_merged_animation.xml and fromOfficial/res/anim/btn_checkbox_to_unchecked_check_path_merged_animation.xml differ
Binary files fromBuild/res/anim/btn_checkbox_to_unchecked_icon_null_animation.xml and fromOfficial/res/anim/btn_checkbox_to_unchecked_icon_null_animation.xml differ
Binary files fromBuild/res/anim/btn_radio_to_off_mtrl_dot_group_animation.xml and fromOfficial/res/anim/btn_radio_to_off_mtrl_dot_group_animation.xml differ
Binary files fromBuild/res/anim/btn_radio_to_off_mtrl_ring_outer_animation.xml and fromOfficial/res/anim/btn_radio_to_off_mtrl_ring_outer_animation.xml differ
Binary files fromBuild/res/anim/btn_radio_to_off_mtrl_ring_outer_path_animation.xml and fromOfficial/res/anim/btn_radio_to_off_mtrl_ring_outer_path_animation.xml differ
Binary files fromBuild/res/anim/btn_radio_to_on_mtrl_dot_group_animation.xml and fromOfficial/res/anim/btn_radio_to_on_mtrl_dot_group_animation.xml differ
Binary files fromBuild/res/anim/btn_radio_to_on_mtrl_ring_outer_animation.xml and fromOfficial/res/anim/btn_radio_to_on_mtrl_ring_outer_animation.xml differ
Binary files fromBuild/res/anim/btn_radio_to_on_mtrl_ring_outer_path_animation.xml and fromOfficial/res/anim/btn_radio_to_on_mtrl_ring_outer_path_animation.xml differ
Only in fromBuild/res/anim: catalyst_fade_in.xml
Only in fromBuild/res/anim: catalyst_fade_out.xml
Only in fromBuild/res/anim: catalyst_push_up_in.xml
Only in fromBuild/res/anim: catalyst_push_up_out.xml
Only in fromBuild/res/anim: catalyst_slide_down.xml
Only in fromBuild/res/anim: catalyst_slide_up.xml
Only in fromBuild/res/anim: decelerate_cubic.xml
Only in fromBuild/res/anim: design_snackbar_in.xml
Only in fromBuild/res/anim: design_snackbar_out.xml
Only in fromBuild/res/anim: mtrl_card_lowers_interpolator.xml
Only in fromBuild/res/anim: popup_enter.xml
Only in fromBuild/res/anim: popup_exit.xml
Only in fromBuild/res/anim: rns_default_enter_in.xml
Only in fromBuild/res/anim: rns_default_enter_out.xml
Only in fromBuild/res/anim: rns_default_exit_in.xml
Only in fromBuild/res/anim: rns_default_exit_out.xml
Only in fromBuild/res/anim: rns_fade_from_bottom.xml
Only in fromBuild/res/anim: rns_fade_in.xml
Only in fromBuild/res/anim: rns_fade_out.xml
Only in fromBuild/res/anim: rns_fade_to_bottom.xml
Only in fromBuild/res/anim: rns_no_animation_20.xml
Only in fromBuild/res/anim: rns_no_animation_250.xml
Only in fromBuild/res/anim: rns_no_animation_350.xml
Only in fromBuild/res/anim: rns_no_animation_medium.xml
Only in fromBuild/res/anim: rns_slide_in_from_bottom.xml
Only in fromBuild/res/anim: rns_slide_in_from_left_ios.xml
Only in fromBuild/res/anim: rns_slide_in_from_left.xml
Only in fromBuild/res/anim: rns_slide_in_from_right_ios.xml
Only in fromBuild/res/anim: rns_slide_in_from_right.xml
Only in fromBuild/res/anim: rns_slide_out_to_bottom.xml
Only in fromBuild/res/anim: rns_slide_out_to_left_ios.xml
Only in fromBuild/res/anim: rns_slide_out_to_left.xml
Only in fromBuild/res/anim: rns_slide_out_to_right_ios.xml
Only in fromBuild/res/anim: rns_slide_out_to_right.xml
Only in fromBuild/res/anim: rns_standard_accelerate_interpolator.xml
Only in fromBuild/res/anim: slide_in_right.xml
Only in fromBuild/res/anim: slide_out_left.xml
Only in fromBuild/res/animator: design_fab_hide_motion_spec.xml
Only in fromBuild/res/animator: design_fab_show_motion_spec.xml
Binary files fromBuild/res/animator/fragment_close_enter.xml and fromOfficial/res/animator/fragment_close_enter.xml differ
Binary files fromBuild/res/animator/fragment_close_exit.xml and fromOfficial/res/animator/fragment_close_exit.xml differ
Binary files fromBuild/res/animator/fragment_open_enter.xml and fromOfficial/res/animator/fragment_open_enter.xml differ
Binary files fromBuild/res/animator/fragment_open_exit.xml and fromOfficial/res/animator/fragment_open_exit.xml differ
Only in fromBuild/res/animator: linear_indeterminate_line1_head_interpolator.xml
Only in fromBuild/res/animator: linear_indeterminate_line1_tail_interpolator.xml
Only in fromBuild/res/animator: linear_indeterminate_line2_head_interpolator.xml
Only in fromBuild/res/animator: linear_indeterminate_line2_tail_interpolator.xml
Only in fromBuild/res/animator: m3_btn_elevated_btn_state_list_anim.xml
Only in fromBuild/res/animator: m3_btn_state_list_anim.xml
Only in fromBuild/res/animator: m3_card_elevated_state_list_anim.xml
Only in fromBuild/res/animator: m3_card_state_list_anim.xml
Only in fromBuild/res/animator: m3_chip_state_list_anim.xml
Only in fromBuild/res/animator: m3_elevated_chip_state_list_anim.xml
Only in fromBuild/res/animator: mtrl_btn_state_list_anim.xml
Only in fromBuild/res/animator: mtrl_btn_unelevated_state_list_anim.xml
Only in fromBuild/res/animator: mtrl_card_state_list_anim.xml
Only in fromBuild/res/animator: mtrl_chip_state_list_anim.xml
Only in fromBuild/res/animator: mtrl_extended_fab_change_size_collapse_motion_spec.xml
Only in fromBuild/res/animator: mtrl_extended_fab_change_size_expand_motion_spec.xml
Only in fromBuild/res/animator: mtrl_extended_fab_hide_motion_spec.xml
Only in fromBuild/res/animator: mtrl_extended_fab_show_motion_spec.xml
Only in fromBuild/res/animator: mtrl_extended_fab_state_list_animator.xml
Only in fromBuild/res/animator: mtrl_fab_hide_motion_spec.xml
Only in fromBuild/res/animator: mtrl_fab_show_motion_spec.xml
Only in fromBuild/res/animator: mtrl_fab_transformation_sheet_collapse_spec.xml
Only in fromBuild/res/animator: mtrl_fab_transformation_sheet_expand_spec.xml
Only in fromBuild/res: animator-v21
Only in fromBuild/res/anim-v21: design_bottom_sheet_slide_in.xml
Only in fromBuild/res/anim-v21: design_bottom_sheet_slide_out.xml
Only in fromBuild/res/anim-v21: mtrl_bottom_sheet_slide_in.xml
Only in fromBuild/res/anim-v21: mtrl_bottom_sheet_slide_out.xml
Only in fromBuild/res: anim-v33
Binary files fromBuild/res/color/abc_background_cache_hint_selector_material_dark.xml and fromOfficial/res/color/abc_background_cache_hint_selector_material_dark.xml differ
Binary files fromBuild/res/color/abc_background_cache_hint_selector_material_light.xml and fromOfficial/res/color/abc_background_cache_hint_selector_material_light.xml differ
Binary files fromBuild/res/color/abc_hint_foreground_material_dark.xml and fromOfficial/res/color/abc_hint_foreground_material_dark.xml differ
Binary files fromBuild/res/color/abc_hint_foreground_material_light.xml and fromOfficial/res/color/abc_hint_foreground_material_light.xml differ
Binary files fromBuild/res/color/abc_primary_text_disable_only_material_dark.xml and fromOfficial/res/color/abc_primary_text_disable_only_material_dark.xml differ
Binary files fromBuild/res/color/abc_primary_text_disable_only_material_light.xml and fromOfficial/res/color/abc_primary_text_disable_only_material_light.xml differ
Binary files fromBuild/res/color/abc_primary_text_material_dark.xml and fromOfficial/res/color/abc_primary_text_material_dark.xml differ
Binary files fromBuild/res/color/abc_primary_text_material_light.xml and fromOfficial/res/color/abc_primary_text_material_light.xml differ
Binary files fromBuild/res/color/abc_search_url_text.xml and fromOfficial/res/color/abc_search_url_text.xml differ
Binary files fromBuild/res/color/abc_secondary_text_material_dark.xml and fromOfficial/res/color/abc_secondary_text_material_dark.xml differ
Binary files fromBuild/res/color/abc_secondary_text_material_light.xml and fromOfficial/res/color/abc_secondary_text_material_light.xml differ
Only in fromBuild/res/color: checkbox_themeable_attribute_color.xml
Only in fromBuild/res/color: common_google_signin_btn_text_dark.xml
Only in fromBuild/res/color: common_google_signin_btn_text_light.xml
Only in fromBuild/res/color: common_google_signin_btn_tint.xml
Only in fromBuild/res/color: design_box_stroke_color.xml
Only in fromBuild/res/color: design_error.xml
Only in fromBuild/res/color: design_icon_tint.xml
Only in fromBuild/res/color: m3_appbar_overlay_color.xml
Only in fromBuild/res/color: m3_assist_chip_icon_tint_color.xml
Only in fromBuild/res/color: m3_assist_chip_stroke_color.xml
Only in fromBuild/res/color: m3_button_background_color_selector.xml
Only in fromBuild/res/color: m3_button_foreground_color_selector.xml
Only in fromBuild/res/color: m3_button_outline_color_selector.xml
Only in fromBuild/res/color: m3_button_ripple_color_selector.xml
Only in fromBuild/res/color: m3_button_ripple_color.xml
Only in fromBuild/res/color: m3_calendar_item_disabled_text.xml
Only in fromBuild/res/color: m3_calendar_item_stroke_color.xml
Only in fromBuild/res/color: m3_card_foreground_color.xml
Only in fromBuild/res/color: m3_card_ripple_color.xml
Only in fromBuild/res/color: m3_card_stroke_color.xml
Only in fromBuild/res/color: m3_chip_assist_text_color.xml
Only in fromBuild/res/color: m3_chip_background_color.xml
Only in fromBuild/res/color: m3_chip_ripple_color.xml
Only in fromBuild/res/color: m3_chip_stroke_color.xml
Only in fromBuild/res/color: m3_chip_text_color.xml
Only in fromBuild/res/color: m3_dark_default_color_primary_text.xml
Only in fromBuild/res/color: m3_dark_default_color_secondary_text.xml
Only in fromBuild/res/color: m3_dark_highlighted_text.xml
Only in fromBuild/res/color: m3_dark_hint_foreground.xml
Only in fromBuild/res/color: m3_dark_primary_text_disable_only.xml
Only in fromBuild/res/color: m3_default_color_primary_text.xml
Only in fromBuild/res/color: m3_default_color_secondary_text.xml
Only in fromBuild/res/color: m3_elevated_chip_background_color.xml
Only in fromBuild/res/color: m3_highlighted_text.xml
Only in fromBuild/res/color: m3_hint_foreground.xml
Only in fromBuild/res/color: m3_navigation_bar_item_with_indicator_icon_tint.xml
Only in fromBuild/res/color: m3_navigation_bar_item_with_indicator_label_tint.xml
Only in fromBuild/res/color: m3_navigation_bar_ripple_color_selector.xml
Only in fromBuild/res/color: m3_navigation_item_background_color.xml
Only in fromBuild/res/color: m3_navigation_item_icon_tint.xml
Only in fromBuild/res/color: m3_navigation_item_ripple_color.xml
Only in fromBuild/res/color: m3_navigation_item_text_color.xml
Only in fromBuild/res/color: m3_popupmenu_overlay_color.xml
Only in fromBuild/res/color: m3_primary_text_disable_only.xml
Only in fromBuild/res/color: m3_radiobutton_ripple_tint.xml
Only in fromBuild/res/color: m3_selection_control_button_tint.xml
Only in fromBuild/res/color: m3_selection_control_ripple_color_selector.xml
Only in fromBuild/res/color: m3_slider_active_track_color.xml
Only in fromBuild/res/color: m3_slider_halo_color.xml
Only in fromBuild/res/color: m3_slider_inactive_track_color.xml
Only in fromBuild/res/color: m3_slider_thumb_color.xml
Only in fromBuild/res/color: m3_switch_thumb_tint.xml
Only in fromBuild/res/color: m3_switch_track_tint.xml
Only in fromBuild/res/color: m3_tabs_icon_color.xml
Only in fromBuild/res/color: m3_tabs_ripple_color.xml
Only in fromBuild/res/color: m3_text_button_background_color_selector.xml
Only in fromBuild/res/color: m3_text_button_foreground_color_selector.xml
Only in fromBuild/res/color: m3_text_button_ripple_color_selector.xml
Only in fromBuild/res/color: m3_textfield_filled_background_color.xml
Only in fromBuild/res/color: m3_textfield_indicator_text_color.xml
Only in fromBuild/res/color: m3_textfield_input_text_color.xml
Only in fromBuild/res/color: m3_textfield_label_color.xml
Only in fromBuild/res/color: m3_textfield_stroke_color.xml
Only in fromBuild/res/color: m3_timepicker_button_background_color.xml
Only in fromBuild/res/color: m3_timepicker_button_ripple_color.xml
Only in fromBuild/res/color: m3_timepicker_button_text_color.xml
Only in fromBuild/res/color: m3_timepicker_clock_text_color.xml
Only in fromBuild/res/color: m3_timepicker_display_background_color.xml
Only in fromBuild/res/color: m3_timepicker_display_ripple_color.xml
Only in fromBuild/res/color: m3_timepicker_display_stroke_color.xml
Only in fromBuild/res/color: m3_timepicker_display_text_color.xml
Only in fromBuild/res/color: m3_timepicker_secondary_text_button_ripple_color.xml
Only in fromBuild/res/color: m3_timepicker_secondary_text_button_text_color.xml
Only in fromBuild/res/color: m3_tonal_button_ripple_color_selector.xml
Only in fromBuild/res/color: material_cursor_color.xml
Only in fromBuild/res/color: material_divider_color.xml
Only in fromBuild/res/color: material_on_background_disabled.xml
Only in fromBuild/res/color: material_on_background_emphasis_high_type.xml
Only in fromBuild/res/color: material_on_background_emphasis_medium.xml
Only in fromBuild/res/color: material_on_primary_disabled.xml
Only in fromBuild/res/color: material_on_primary_emphasis_high_type.xml
Only in fromBuild/res/color: material_on_primary_emphasis_medium.xml
Only in fromBuild/res/color: material_on_surface_disabled.xml
Only in fromBuild/res/color: material_on_surface_emphasis_high_type.xml
Only in fromBuild/res/color: material_on_surface_emphasis_medium.xml
Only in fromBuild/res/color: material_on_surface_stroke.xml
Only in fromBuild/res/color: material_slider_active_tick_marks_color.xml
Only in fromBuild/res/color: material_slider_active_track_color.xml
Only in fromBuild/res/color: material_slider_halo_color.xml
Only in fromBuild/res/color: material_slider_inactive_tick_marks_color.xml
Only in fromBuild/res/color: material_slider_inactive_track_color.xml
Only in fromBuild/res/color: material_slider_thumb_color.xml
Only in fromBuild/res/color: material_timepicker_button_background.xml
Only in fromBuild/res/color: material_timepicker_button_stroke.xml
Only in fromBuild/res/color: material_timepicker_clockface.xml
Only in fromBuild/res/color: material_timepicker_clock_text_color.xml
Only in fromBuild/res/color: material_timepicker_modebutton_tint.xml
Only in fromBuild/res/color: mtrl_btn_bg_color_selector.xml
Only in fromBuild/res/color: mtrl_btn_ripple_color.xml
Only in fromBuild/res/color: mtrl_btn_stroke_color_selector.xml
Only in fromBuild/res/color: mtrl_btn_text_btn_bg_color_selector.xml
Only in fromBuild/res/color: mtrl_btn_text_btn_ripple_color.xml
Only in fromBuild/res/color: mtrl_btn_text_color_selector.xml
Only in fromBuild/res/color: mtrl_calendar_item_stroke_color.xml
Only in fromBuild/res/color: mtrl_calendar_selected_range.xml
Only in fromBuild/res/color: mtrl_card_view_foreground.xml
Only in fromBuild/res/color: mtrl_card_view_ripple.xml
Only in fromBuild/res/color: mtrl_chip_background_color.xml
Only in fromBuild/res/color: mtrl_chip_close_icon_tint.xml
Only in fromBuild/res/color: mtrl_chip_surface_color.xml
Only in fromBuild/res/color: mtrl_chip_text_color.xml
Only in fromBuild/res/color: mtrl_choice_chip_background_color.xml
Only in fromBuild/res/color: mtrl_choice_chip_ripple_color.xml
Only in fromBuild/res/color: mtrl_choice_chip_text_color.xml
Only in fromBuild/res/color: mtrl_error.xml
Only in fromBuild/res/color: mtrl_fab_bg_color_selector.xml
Only in fromBuild/res/color: mtrl_fab_icon_text_color_selector.xml
Only in fromBuild/res/color: mtrl_fab_ripple_color.xml
Only in fromBuild/res/color: mtrl_filled_background_color.xml
Only in fromBuild/res/color: mtrl_filled_icon_tint.xml
Only in fromBuild/res/color: mtrl_filled_stroke_color.xml
Only in fromBuild/res/color: mtrl_indicator_text_color.xml
Only in fromBuild/res/color: mtrl_navigation_bar_colored_item_tint.xml
Only in fromBuild/res/color: mtrl_navigation_bar_colored_ripple_color.xml
Only in fromBuild/res/color: mtrl_navigation_bar_item_tint.xml
Only in fromBuild/res/color: mtrl_navigation_bar_ripple_color.xml
Only in fromBuild/res/color: mtrl_navigation_item_background_color.xml
Only in fromBuild/res/color: mtrl_navigation_item_icon_tint.xml
Only in fromBuild/res/color: mtrl_navigation_item_text_color.xml
Only in fromBuild/res/color: mtrl_on_primary_text_btn_text_color_selector.xml
Only in fromBuild/res/color: mtrl_on_surface_ripple_color.xml
Only in fromBuild/res/color: mtrl_outlined_icon_tint.xml
Only in fromBuild/res/color: mtrl_outlined_stroke_color.xml
Only in fromBuild/res/color: mtrl_popupmenu_overlay_color.xml
Only in fromBuild/res/color: mtrl_tabs_colored_ripple_color.xml
Only in fromBuild/res/color: mtrl_tabs_icon_color_selector_colored.xml
Only in fromBuild/res/color: mtrl_tabs_icon_color_selector.xml
Only in fromBuild/res/color: mtrl_tabs_legacy_text_color_selector.xml
Only in fromBuild/res/color: mtrl_tabs_ripple_color.xml
Only in fromBuild/res/color: mtrl_text_btn_text_color_selector.xml
Only in fromBuild/res/color: radiobutton_themeable_attribute_color.xml
Binary files fromBuild/res/color/switch_thumb_material_dark.xml and fromOfficial/res/color/switch_thumb_material_dark.xml differ
Binary files fromBuild/res/color/switch_thumb_material_light.xml and fromOfficial/res/color/switch_thumb_material_light.xml differ
Only in fromBuild/res/color: test_mtrl_calendar_day_selected.xml
Only in fromBuild/res/color: test_mtrl_calendar_day.xml
Only in fromBuild/res: color-night-v8
Binary files fromBuild/res/color-v23/abc_btn_colored_borderless_text_material.xml and fromOfficial/res/color-v23/abc_btn_colored_borderless_text_material.xml differ
Binary files fromBuild/res/color-v23/abc_btn_colored_text_material.xml and fromOfficial/res/color-v23/abc_btn_colored_text_material.xml differ
Binary files fromBuild/res/color-v23/abc_color_highlight_material.xml and fromOfficial/res/color-v23/abc_color_highlight_material.xml differ
Binary files fromBuild/res/color-v23/abc_tint_btn_checkable.xml and fromOfficial/res/color-v23/abc_tint_btn_checkable.xml differ
Binary files fromBuild/res/color-v23/abc_tint_default.xml and fromOfficial/res/color-v23/abc_tint_default.xml differ
Binary files fromBuild/res/color-v23/abc_tint_edittext.xml and fromOfficial/res/color-v23/abc_tint_edittext.xml differ
Binary files fromBuild/res/color-v23/abc_tint_seek_thumb.xml and fromOfficial/res/color-v23/abc_tint_seek_thumb.xml differ
Binary files fromBuild/res/color-v23/abc_tint_spinner.xml and fromOfficial/res/color-v23/abc_tint_spinner.xml differ
Binary files fromBuild/res/color-v23/abc_tint_switch_track.xml and fromOfficial/res/color-v23/abc_tint_switch_track.xml differ
Only in fromOfficial/res: color-v26
Only in fromBuild/res: color-v31
Only in fromBuild/res/drawable: $avd_hide_password__0.xml
Only in fromBuild/res/drawable: $avd_hide_password__1.xml
Only in fromBuild/res/drawable: $avd_hide_password__2.xml
Only in fromBuild/res/drawable: $avd_show_password__0.xml
Only in fromBuild/res/drawable: $avd_show_password__1.xml
Only in fromBuild/res/drawable: $avd_show_password__2.xml
Only in fromBuild/res/drawable: $avd_splash__0.xml
Only in fromBuild/res/drawable: $avd_splash__1.xml
Only in fromBuild/res/drawable: $avd_splash__2.xml
Binary files fromBuild/res/drawable/abc_btn_borderless_material.xml and fromOfficial/res/drawable/abc_btn_borderless_material.xml differ
Binary files fromBuild/res/drawable/abc_btn_check_material_anim.xml and fromOfficial/res/drawable/abc_btn_check_material_anim.xml differ
Binary files fromBuild/res/drawable/abc_btn_check_material.xml and fromOfficial/res/drawable/abc_btn_check_material.xml differ
Binary files fromBuild/res/drawable/abc_btn_default_mtrl_shape.xml and fromOfficial/res/drawable/abc_btn_default_mtrl_shape.xml differ
Binary files fromBuild/res/drawable/abc_btn_radio_material_anim.xml and fromOfficial/res/drawable/abc_btn_radio_material_anim.xml differ
Binary files fromBuild/res/drawable/abc_btn_radio_material.xml and fromOfficial/res/drawable/abc_btn_radio_material.xml differ
Binary files fromBuild/res/drawable/abc_ic_ab_back_material.xml and fromOfficial/res/drawable/abc_ic_ab_back_material.xml differ
Binary files fromBuild/res/drawable/abc_ic_arrow_drop_right_black_24dp.xml and fromOfficial/res/drawable/abc_ic_arrow_drop_right_black_24dp.xml differ
Binary files fromBuild/res/drawable/abc_ic_clear_material.xml and fromOfficial/res/drawable/abc_ic_clear_material.xml differ
Binary files fromBuild/res/drawable/abc_ic_go_search_api_material.xml and fromOfficial/res/drawable/abc_ic_go_search_api_material.xml differ
Binary files fromBuild/res/drawable/abc_ic_menu_overflow_material.xml and fromOfficial/res/drawable/abc_ic_menu_overflow_material.xml differ
Binary files fromBuild/res/drawable/abc_ic_search_api_material.xml and fromOfficial/res/drawable/abc_ic_search_api_material.xml differ
Binary files fromBuild/res/drawable/abc_ic_voice_search_api_material.xml and fromOfficial/res/drawable/abc_ic_voice_search_api_material.xml differ
Binary files fromBuild/res/drawable/abc_item_background_holo_dark.xml and fromOfficial/res/drawable/abc_item_background_holo_dark.xml differ
Binary files fromBuild/res/drawable/abc_item_background_holo_light.xml and fromOfficial/res/drawable/abc_item_background_holo_light.xml differ
Binary files fromBuild/res/drawable/abc_list_selector_background_transition_holo_dark.xml and fromOfficial/res/drawable/abc_list_selector_background_transition_holo_dark.xml differ
Binary files fromBuild/res/drawable/abc_list_selector_background_transition_holo_light.xml and fromOfficial/res/drawable/abc_list_selector_background_transition_holo_light.xml differ
Binary files fromBuild/res/drawable/abc_list_selector_holo_dark.xml and fromOfficial/res/drawable/abc_list_selector_holo_dark.xml differ
Binary files fromBuild/res/drawable/abc_list_selector_holo_light.xml and fromOfficial/res/drawable/abc_list_selector_holo_light.xml differ
Binary files fromBuild/res/drawable/abc_seekbar_thumb_material.xml and fromOfficial/res/drawable/abc_seekbar_thumb_material.xml differ
Binary files fromBuild/res/drawable/abc_seekbar_tick_mark_material.xml and fromOfficial/res/drawable/abc_seekbar_tick_mark_material.xml differ
Binary files fromBuild/res/drawable/abc_seekbar_track_material.xml and fromOfficial/res/drawable/abc_seekbar_track_material.xml differ
Binary files fromBuild/res/drawable/abc_spinner_textfield_background_material.xml and fromOfficial/res/drawable/abc_spinner_textfield_background_material.xml differ
Binary files fromBuild/res/drawable/abc_switch_thumb_material.xml and fromOfficial/res/drawable/abc_switch_thumb_material.xml differ
Binary files fromBuild/res/drawable/abc_tab_indicator_material.xml and fromOfficial/res/drawable/abc_tab_indicator_material.xml differ
Binary files fromBuild/res/drawable/abc_textfield_search_material.xml and fromOfficial/res/drawable/abc_textfield_search_material.xml differ
Only in fromBuild/res/drawable: avd_hide_password.xml
Only in fromBuild/res/drawable: avd_show_password.xml
Only in fromBuild/res/drawable: avd_splash.xml
Binary files fromBuild/res/drawable/btn_checkbox_checked_to_unchecked_mtrl_animation.xml and fromOfficial/res/drawable/btn_checkbox_checked_to_unchecked_mtrl_animation.xml differ
Binary files fromBuild/res/drawable/btn_checkbox_unchecked_to_checked_mtrl_animation.xml and fromOfficial/res/drawable/btn_checkbox_unchecked_to_checked_mtrl_animation.xml differ
Binary files fromBuild/res/drawable/btn_radio_off_to_on_mtrl_animation.xml and fromOfficial/res/drawable/btn_radio_off_to_on_mtrl_animation.xml differ
Binary files fromBuild/res/drawable/btn_radio_on_to_off_mtrl_animation.xml and fromOfficial/res/drawable/btn_radio_on_to_off_mtrl_animation.xml differ
Only in fromBuild/res/drawable: common_google_signin_btn_icon_dark_focused.xml
Only in fromBuild/res/drawable: common_google_signin_btn_icon_dark_normal.xml
Only in fromBuild/res/drawable: common_google_signin_btn_icon_dark.xml
Only in fromBuild/res/drawable: common_google_signin_btn_icon_disabled.xml
Only in fromBuild/res/drawable: common_google_signin_btn_icon_light_focused.xml
Only in fromBuild/res/drawable: common_google_signin_btn_icon_light_normal.xml
Only in fromBuild/res/drawable: common_google_signin_btn_icon_light.xml
Only in fromBuild/res/drawable: common_google_signin_btn_text_dark_focused.xml
Only in fromBuild/res/drawable: common_google_signin_btn_text_dark_normal.xml
Only in fromBuild/res/drawable: common_google_signin_btn_text_dark.xml
Only in fromBuild/res/drawable: common_google_signin_btn_text_disabled.xml
Only in fromBuild/res/drawable: common_google_signin_btn_text_light_focused.xml
Only in fromBuild/res/drawable: common_google_signin_btn_text_light_normal.xml
Only in fromBuild/res/drawable: common_google_signin_btn_text_light.xml
Only in fromBuild/res/drawable: design_fab_background.xml
Only in fromBuild/res/drawable: design_ic_visibility_off.xml
Only in fromBuild/res/drawable: design_ic_visibility.xml
Only in fromBuild/res/drawable: design_password_eye.xml
Only in fromBuild/res/drawable: design_snackbar_background.xml
Only in fromOfficial/res/drawable: envoy_mono.xml
Only in fromBuild/res/drawable: ic_clock_black_24dp.xml
Only in fromBuild/res/drawable: ic_dropdown.xml
Only in fromBuild/res/drawable: ic_fingerprint_error.xml
Only in fromBuild/res/drawable: ic_fingerprint_success.xml
Only in fromBuild/res/drawable: ic_keyboard_black_24dp.xml
Only in fromBuild/res/drawable: ic_m3_chip_checked_circle.xml
Only in fromBuild/res/drawable: ic_m3_chip_check.xml
Only in fromBuild/res/drawable: ic_m3_chip_close.xml
Only in fromBuild/res/drawable: ic_mtrl_checked_circle.xml
Only in fromBuild/res/drawable: ic_mtrl_chip_checked_black.xml
Only in fromBuild/res/drawable: ic_mtrl_chip_checked_circle.xml
Only in fromBuild/res/drawable: ic_mtrl_chip_close_circle.xml
Binary files fromBuild/res/drawable/icon_background.xml and fromOfficial/res/drawable/icon_background.xml differ
Only in fromBuild/res/drawable: m3_tabs_line_indicator.xml
Only in fromBuild/res/drawable: m3_tabs_rounded_line_indicator.xml
Only in fromBuild/res/drawable: material_ic_calendar_black_24dp.xml
Only in fromBuild/res/drawable: material_ic_clear_black_24dp.xml
Only in fromBuild/res/drawable: material_ic_edit_black_24dp.xml
Only in fromBuild/res/drawable: material_ic_keyboard_arrow_left_black_24dp.xml
Only in fromBuild/res/drawable: material_ic_keyboard_arrow_right_black_24dp.xml
Only in fromBuild/res/drawable: material_ic_menu_arrow_down_black_24dp.xml
Only in fromBuild/res/drawable: material_ic_menu_arrow_up_black_24dp.xml
Only in fromBuild/res/drawable: md_btn_selected_dark.xml
Only in fromBuild/res/drawable: md_btn_selected.xml
Only in fromBuild/res/drawable: md_btn_selector_dark.xml
Only in fromBuild/res/drawable: md_btn_selector.xml
Only in fromBuild/res/drawable: md_item_selected_dark.xml
Only in fromBuild/res/drawable: md_item_selected.xml
Only in fromBuild/res/drawable: md_selector_dark.xml
Only in fromBuild/res/drawable: md_selector.xml
Only in fromBuild/res/drawable: md_transparent.xml
Only in fromBuild/res/drawable: mtrl_dialog_background.xml
Only in fromBuild/res/drawable: mtrl_dropdown_arrow.xml
Only in fromBuild/res/drawable: mtrl_ic_arrow_drop_down.xml
Only in fromBuild/res/drawable: mtrl_ic_arrow_drop_up.xml
Only in fromBuild/res/drawable: mtrl_ic_cancel.xml
Only in fromBuild/res/drawable: mtrl_ic_error.xml
Only in fromBuild/res/drawable: mtrl_popupmenu_background.xml
Only in fromBuild/res/drawable: mtrl_tabs_default_indicator.xml
Only in fromBuild/res/drawable: navigation_empty_icon.xml
Binary files fromBuild/res/drawable/notification_bg_low.xml and fromOfficial/res/drawable/notification_bg_low.xml differ
Binary files fromBuild/res/drawable/notification_bg.xml and fromOfficial/res/drawable/notification_bg.xml differ
Binary files fromBuild/res/drawable/notification_icon_background.xml and fromOfficial/res/drawable/notification_icon_background.xml differ
Binary files fromBuild/res/drawable/notification_tile_bg.xml and fromOfficial/res/drawable/notification_tile_bg.xml differ
Only in fromBuild/res/drawable: redbox_top_border_background.xml
Only in fromBuild/res/drawable: spinner_dropdown_background.xml
Only in fromOfficial/res/drawable: splash_background.xml
Only in fromOfficial/res/drawable: splash_logo.png
Only in fromOfficial/res/drawable: splash.png
Only in fromBuild/res/drawable: test_custom_background.xml
Binary files fromBuild/res/drawable/test_level_drawable.xml and fromOfficial/res/drawable/test_level_drawable.xml differ
Binary files fromBuild/res/drawable/tooltip_frame_dark.xml and fromOfficial/res/drawable/tooltip_frame_dark.xml differ
Binary files fromBuild/res/drawable/tooltip_frame_light.xml and fromOfficial/res/drawable/tooltip_frame_light.xml differ
Only in fromBuild/res/drawable: vd_splash.xml
Only in fromBuild/res: drawable-anydpi-v21
Only in fromOfficial/res: drawable-anydpi-v23
Only in fromBuild/res/drawable-hdpi-v4: abc_ab_share_pack_mtrl_alpha.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_btn_check_to_on_mtrl_000.png
Only in fromBuild/res/drawable-hdpi-v4: abc_btn_check_to_on_mtrl_015.png
Only in fromBuild/res/drawable-hdpi-v4: abc_btn_radio_to_on_mtrl_000.png
Only in fromBuild/res/drawable-hdpi-v4: abc_btn_radio_to_on_mtrl_015.png
Only in fromBuild/res/drawable-hdpi-v4: abc_btn_switch_to_on_mtrl_00001.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_btn_switch_to_on_mtrl_00012.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_cab_background_top_mtrl_alpha.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_ic_commit_search_api_mtrl_alpha.png
Only in fromBuild/res/drawable-hdpi-v4: abc_list_divider_mtrl_alpha.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_list_focused_holo.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_list_longpressed_holo.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_list_pressed_holo_dark.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_list_pressed_holo_light.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_list_selector_disabled_holo_dark.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_list_selector_disabled_holo_light.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_menu_hardkey_panel_mtrl_mult.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_popup_background_mtrl_mult.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_scrubber_control_off_mtrl_alpha.png
Only in fromBuild/res/drawable-hdpi-v4: abc_scrubber_control_to_pressed_mtrl_000.png
Only in fromBuild/res/drawable-hdpi-v4: abc_scrubber_control_to_pressed_mtrl_005.png
Only in fromBuild/res/drawable-hdpi-v4: abc_scrubber_primary_mtrl_alpha.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_scrubber_track_mtrl_alpha.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_spinner_mtrl_am_alpha.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_switch_track_mtrl_alpha.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_tab_indicator_mtrl_alpha.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_textfield_activated_mtrl_alpha.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_textfield_default_mtrl_alpha.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_textfield_search_activated_mtrl_alpha.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_textfield_search_default_mtrl_alpha.9.png
Only in fromBuild/res/drawable-hdpi-v4: abc_text_select_handle_left_mtrl.png
Only in fromBuild/res/drawable-hdpi-v4: abc_text_select_handle_middle_mtrl.png
Only in fromBuild/res/drawable-hdpi-v4: abc_text_select_handle_right_mtrl.png
Only in fromBuild/res/drawable-hdpi-v4: common_full_open_on_phone.png
Only in fromBuild/res/drawable-hdpi-v4: common_google_signin_btn_icon_dark_normal_background.9.png
Only in fromBuild/res/drawable-hdpi-v4: common_google_signin_btn_icon_light_normal_background.9.png
Only in fromBuild/res/drawable-hdpi-v4: common_google_signin_btn_text_dark_normal_background.9.png
Only in fromBuild/res/drawable-hdpi-v4: common_google_signin_btn_text_light_normal_background.9.png
Only in fromBuild/res/drawable-hdpi-v4: googleg_disabled_color_18.png
Only in fromBuild/res/drawable-hdpi-v4: googleg_standard_color_18.png
Only in fromBuild/res/drawable-hdpi-v4: ic_fp_40px.png
Only in fromBuild/res/drawable-hdpi-v4: md_nav_back.png
Only in fromBuild/res/drawable-hdpi-v4: node_modules_reactnavigation_drawer_src_views_assets_toggledrawericon.png
Only in fromBuild/res/drawable-hdpi-v4: node_modules_reactnavigation_elements_src_assets_backicon.png
Only in fromBuild/res/drawable-hdpi-v4: notification_bg_low_normal.9.png
Only in fromBuild/res/drawable-hdpi-v4: notification_bg_low_pressed.9.png
Only in fromBuild/res/drawable-hdpi-v4: notification_bg_normal.9.png
Only in fromBuild/res/drawable-hdpi-v4: notification_bg_normal_pressed.9.png
Only in fromOfficial/res/drawable-hdpi-v4: notification_oversize_large_icon_bg.png
Only in fromBuild/res/drawable-hdpi-v4: notify_panel_notification_icon_bg.png
Only in fromBuild/res: drawable-ldpi-v4
Only in fromBuild/res: drawable-ldrtl-hdpi-v17
Only in fromBuild/res: drawable-ldrtl-mdpi-v17
Only in fromBuild/res: drawable-ldrtl-xhdpi-v17
Only in fromBuild/res: drawable-ldrtl-xxhdpi-v17
Only in fromBuild/res: drawable-ldrtl-xxxhdpi-v17
Only in fromBuild/res: drawable-mdpi-v4
Binary files fromBuild/res/drawable-v21/abc_btn_colored_material.xml and fromOfficial/res/drawable-v21/abc_btn_colored_material.xml differ
Binary files fromBuild/res/drawable-v21/abc_dialog_material_background.xml and fromOfficial/res/drawable-v21/abc_dialog_material_background.xml differ
Binary files fromBuild/res/drawable-v21/abc_edit_text_material.xml and fromOfficial/res/drawable-v21/abc_edit_text_material.xml differ
Only in fromOfficial/res/drawable-v21: launch_background.xml
Only in fromBuild/res/drawable-v21: material_cursor_drawable.xml
Only in fromBuild/res/drawable-v21: md_btn_selector_ripple_dark.xml
Only in fromBuild/res/drawable-v21: md_btn_selector_ripple.xml
Only in fromBuild/res/drawable-v21: md_btn_shape.xml
Only in fromBuild/res/drawable-v21: mtrl_navigation_bar_item_background.xml
Binary files fromBuild/res/drawable-v21/notification_action_background.xml and fromOfficial/res/drawable-v21/notification_action_background.xml differ
Binary files fromBuild/res/drawable-v23/abc_control_background_material.xml and fromOfficial/res/drawable-v23/abc_control_background_material.xml differ
Binary files fromBuild/res/drawable-v23/compat_splash_screen_no_icon_background.xml and fromOfficial/res/drawable-v23/compat_splash_screen_no_icon_background.xml differ
Binary files fromBuild/res/drawable-v23/compat_splash_screen.xml and fromOfficial/res/drawable-v23/compat_splash_screen.xml differ
Only in fromBuild/res/drawable-v23: m3_appbar_background.xml
Only in fromBuild/res/drawable-v23: m3_popupmenu_background_overlay.xml
Only in fromBuild/res/drawable-v23: m3_radiobutton_ripple.xml
Only in fromBuild/res/drawable-v23: m3_selection_control_ripple.xml
Only in fromBuild/res/drawable-v23: m3_tabs_background.xml
Only in fromBuild/res/drawable-v23: m3_tabs_transparent_background.xml
Only in fromBuild/res/drawable-v23: mtrl_popupmenu_background_overlay.xml
Only in fromBuild/res: drawable-v29
Only in fromBuild/res/drawable-watch-v20: common_google_signin_btn_text_dark_normal.xml
Only in fromBuild/res/drawable-watch-v20: common_google_signin_btn_text_disabled.xml
Only in fromBuild/res/drawable-watch-v20: common_google_signin_btn_text_light_normal.xml
Only in fromBuild/res: drawable-xhdpi-v4
Only in fromBuild/res: drawable-xxhdpi-v4
Only in fromBuild/res: drawable-xxxhdpi-v4
Only in fromBuild/res/interpolator: mtrl_linear.xml
Only in fromBuild/res: interpolator-v21
Binary files fromBuild/res/layout/abc_action_bar_title_item.xml and fromOfficial/res/layout/abc_action_bar_title_item.xml differ
Binary files fromBuild/res/layout/abc_action_bar_up_container.xml and fromOfficial/res/layout/abc_action_bar_up_container.xml differ
Binary files fromBuild/res/layout/abc_action_menu_item_layout.xml and fromOfficial/res/layout/abc_action_menu_item_layout.xml differ
Binary files fromBuild/res/layout/abc_action_menu_layout.xml and fromOfficial/res/layout/abc_action_menu_layout.xml differ
Binary files fromBuild/res/layout/abc_action_mode_bar.xml and fromOfficial/res/layout/abc_action_mode_bar.xml differ
Binary files fromBuild/res/layout/abc_action_mode_close_item_material.xml and fromOfficial/res/layout/abc_action_mode_close_item_material.xml differ
Binary files fromBuild/res/layout/abc_activity_chooser_view_list_item.xml and fromOfficial/res/layout/abc_activity_chooser_view_list_item.xml differ
Binary files fromBuild/res/layout/abc_activity_chooser_view.xml and fromOfficial/res/layout/abc_activity_chooser_view.xml differ
Binary files fromBuild/res/layout/abc_alert_dialog_button_bar_material.xml and fromOfficial/res/layout/abc_alert_dialog_button_bar_material.xml differ
Binary files fromBuild/res/layout/abc_alert_dialog_material.xml and fromOfficial/res/layout/abc_alert_dialog_material.xml differ
Binary files fromBuild/res/layout/abc_alert_dialog_title_material.xml and fromOfficial/res/layout/abc_alert_dialog_title_material.xml differ
Binary files fromBuild/res/layout/abc_cascading_menu_item_layout.xml and fromOfficial/res/layout/abc_cascading_menu_item_layout.xml differ
Binary files fromBuild/res/layout/abc_dialog_title_material.xml and fromOfficial/res/layout/abc_dialog_title_material.xml differ
Binary files fromBuild/res/layout/abc_expanded_menu_layout.xml and fromOfficial/res/layout/abc_expanded_menu_layout.xml differ
Binary files fromBuild/res/layout/abc_list_menu_item_checkbox.xml and fromOfficial/res/layout/abc_list_menu_item_checkbox.xml differ
Binary files fromBuild/res/layout/abc_list_menu_item_icon.xml and fromOfficial/res/layout/abc_list_menu_item_icon.xml differ
Binary files fromBuild/res/layout/abc_list_menu_item_layout.xml and fromOfficial/res/layout/abc_list_menu_item_layout.xml differ
Binary files fromBuild/res/layout/abc_list_menu_item_radio.xml and fromOfficial/res/layout/abc_list_menu_item_radio.xml differ
Binary files fromBuild/res/layout/abc_popup_menu_header_item_layout.xml and fromOfficial/res/layout/abc_popup_menu_header_item_layout.xml differ
Binary files fromBuild/res/layout/abc_popup_menu_item_layout.xml and fromOfficial/res/layout/abc_popup_menu_item_layout.xml differ
Binary files fromBuild/res/layout/abc_screen_content_include.xml and fromOfficial/res/layout/abc_screen_content_include.xml differ
Binary files fromBuild/res/layout/abc_screen_simple_overlay_action_mode.xml and fromOfficial/res/layout/abc_screen_simple_overlay_action_mode.xml differ
Binary files fromBuild/res/layout/abc_screen_simple.xml and fromOfficial/res/layout/abc_screen_simple.xml differ
Binary files fromBuild/res/layout/abc_search_dropdown_item_icons_2line.xml and fromOfficial/res/layout/abc_search_dropdown_item_icons_2line.xml differ
Binary files fromBuild/res/layout/abc_search_view.xml and fromOfficial/res/layout/abc_search_view.xml differ
Binary files fromBuild/res/layout/abc_select_dialog_material.xml and fromOfficial/res/layout/abc_select_dialog_material.xml differ
Binary files fromBuild/res/layout/abc_tooltip.xml and fromOfficial/res/layout/abc_tooltip.xml differ
Only in fromBuild/res/layout: autofill_inline_suggestion.xml
Binary files fromBuild/res/layout/browser_actions_context_menu_page.xml and fromOfficial/res/layout/browser_actions_context_menu_page.xml differ
Binary files fromBuild/res/layout/browser_actions_context_menu_row.xml and fromOfficial/res/layout/browser_actions_context_menu_row.xml differ
Binary files fromBuild/res/layout/custom_dialog.xml and fromOfficial/res/layout/custom_dialog.xml differ
Only in fromBuild/res/layout: design_bottom_navigation_item.xml
Only in fromBuild/res/layout: design_bottom_sheet_dialog.xml
Only in fromBuild/res/layout: design_layout_snackbar_include.xml
Only in fromBuild/res/layout: design_layout_snackbar.xml
Only in fromBuild/res/layout: design_layout_tab_icon.xml
Only in fromBuild/res/layout: design_layout_tab_text.xml
Only in fromBuild/res/layout: design_menu_item_action_area.xml
Only in fromBuild/res/layout: design_navigation_item_header.xml
Only in fromBuild/res/layout: design_navigation_item_separator.xml
Only in fromBuild/res/layout: design_navigation_item_subheader.xml
Only in fromBuild/res/layout: design_navigation_item.xml
Only in fromBuild/res/layout: design_navigation_menu_item.xml
Only in fromBuild/res/layout: design_navigation_menu.xml
Only in fromBuild/res/layout: design_text_input_end_icon.xml
Only in fromBuild/res/layout: design_text_input_start_icon.xml
Only in fromBuild/res/layout: dev_loading_view.xml
Only in fromBuild/res/layout: fingerprint_dialog_container.xml
Only in fromBuild/res/layout: fingerprint_dialog_content.xml
Only in fromOfficial/res/layout: fingerprint_dialog_layout.xml
Only in fromBuild/res/layout: fps_view.xml
Only in fromOfficial/res/layout: go_to_setting.xml
Only in fromOfficial/res/layout: ime_base_split_test_activity.xml
Only in fromOfficial/res/layout: ime_secondary_split_test_activity.xml
Only in fromBuild/res/layout: m3_alert_dialog_actions.xml
Only in fromBuild/res/layout: m3_alert_dialog_title.xml
Only in fromBuild/res/layout: m3_alert_dialog.xml
Only in fromBuild/res/layout: m3_auto_complete_simple_item.xml
Only in fromBuild/res/layout: material_chip_input_combo.xml
Only in fromBuild/res/layout: material_clock_display_divider.xml
Only in fromBuild/res/layout: material_clock_display.xml
Only in fromBuild/res/layout: material_clockface_textview.xml
Only in fromBuild/res/layout: material_clockface_view.xml
Only in fromBuild/res/layout: material_clock_period_toggle.xml
Only in fromBuild/res/layout: material_radial_view_group.xml
Only in fromBuild/res/layout: material_textinput_timepicker.xml
Only in fromBuild/res/layout: material_time_chip.xml
Only in fromBuild/res/layout: material_time_input.xml
Only in fromBuild/res/layout: material_timepicker_dialog.xml
Only in fromBuild/res/layout: material_timepicker_textinput_display.xml
Only in fromBuild/res/layout: material_timepicker.xml
Only in fromBuild/res/layout: md_dialog_basic_check.xml
Only in fromBuild/res/layout: md_dialog_basic.xml
Only in fromBuild/res/layout: md_dialog_custom.xml
Only in fromBuild/res/layout: md_dialog_input_check.xml
Only in fromBuild/res/layout: md_dialog_input.xml
Only in fromBuild/res/layout: md_dialog_list_check.xml
Only in fromBuild/res/layout: md_dialog_list.xml
Only in fromBuild/res/layout: md_dialog_progress_indeterminate_horizontal.xml
Only in fromBuild/res/layout: md_dialog_progress_indeterminate.xml
Only in fromBuild/res/layout: md_dialog_progress.xml
Only in fromBuild/res/layout: md_listitem_multichoice.xml
Only in fromBuild/res/layout: md_listitem_singlechoice.xml
Only in fromBuild/res/layout: md_listitem.xml
Only in fromBuild/res/layout: md_stub_actionbuttons.xml
Only in fromBuild/res/layout: md_stub_titleframe_lesspadding.xml
Only in fromBuild/res/layout: md_stub_titleframe.xml
Only in fromBuild/res/layout: mtrl_alert_dialog_actions.xml
Only in fromBuild/res/layout: mtrl_alert_dialog_title.xml
Only in fromBuild/res/layout: mtrl_alert_dialog.xml
Only in fromBuild/res/layout: mtrl_alert_select_dialog_item.xml
Only in fromBuild/res/layout: mtrl_alert_select_dialog_multichoice.xml
Only in fromBuild/res/layout: mtrl_alert_select_dialog_singlechoice.xml
Only in fromBuild/res/layout: mtrl_auto_complete_simple_item.xml
Only in fromBuild/res/layout: mtrl_calendar_day_of_week.xml
Only in fromBuild/res/layout: mtrl_calendar_days_of_week.xml
Only in fromBuild/res/layout: mtrl_calendar_day.xml
Only in fromBuild/res/layout: mtrl_calendar_horizontal.xml
Only in fromBuild/res/layout: mtrl_calendar_month_labeled.xml
Only in fromBuild/res/layout: mtrl_calendar_month_navigation.xml
Only in fromBuild/res/layout: mtrl_calendar_months.xml
Only in fromBuild/res/layout: mtrl_calendar_vertical.xml
Only in fromBuild/res/layout: mtrl_calendar_year.xml
Only in fromBuild/res/layout: mtrl_layout_snackbar_include.xml
Only in fromBuild/res/layout: mtrl_layout_snackbar.xml
Only in fromBuild/res/layout: mtrl_navigation_rail_item.xml
Only in fromBuild/res/layout: mtrl_picker_actions.xml
Only in fromBuild/res/layout: mtrl_picker_dialog.xml
Only in fromBuild/res/layout: mtrl_picker_fullscreen.xml
Only in fromBuild/res/layout: mtrl_picker_header_dialog.xml
Only in fromBuild/res/layout: mtrl_picker_header_fullscreen.xml
Only in fromBuild/res/layout: mtrl_picker_header_selection_text.xml
Only in fromBuild/res/layout: mtrl_picker_header_title_text.xml
Only in fromBuild/res/layout: mtrl_picker_header_toggle.xml
Only in fromBuild/res/layout: mtrl_picker_text_input_date_range.xml
Only in fromBuild/res/layout: mtrl_picker_text_input_date.xml
Binary files fromBuild/res/layout/notification_media_action.xml and fromOfficial/res/layout/notification_media_action.xml differ
Binary files fromBuild/res/layout/notification_media_cancel_action.xml and fromOfficial/res/layout/notification_media_cancel_action.xml differ
Binary files fromBuild/res/layout/notification_template_big_media_custom.xml and fromOfficial/res/layout/notification_template_big_media_custom.xml differ
Binary files fromBuild/res/layout/notification_template_big_media_narrow_custom.xml and fromOfficial/res/layout/notification_template_big_media_narrow_custom.xml differ
Binary files fromBuild/res/layout/notification_template_big_media_narrow.xml and fromOfficial/res/layout/notification_template_big_media_narrow.xml differ
Binary files fromBuild/res/layout/notification_template_big_media.xml and fromOfficial/res/layout/notification_template_big_media.xml differ
Binary files fromBuild/res/layout/notification_template_lines_media.xml and fromOfficial/res/layout/notification_template_lines_media.xml differ
Binary files fromBuild/res/layout/notification_template_media_custom.xml and fromOfficial/res/layout/notification_template_media_custom.xml differ
Binary files fromBuild/res/layout/notification_template_media.xml and fromOfficial/res/layout/notification_template_media.xml differ
Binary files fromBuild/res/layout/notification_template_part_chronometer.xml and fromOfficial/res/layout/notification_template_part_chronometer.xml differ
Binary files fromBuild/res/layout/notification_template_part_time.xml and fromOfficial/res/layout/notification_template_part_time.xml differ
Only in fromOfficial/res/layout: player_remote.xml
Only in fromBuild/res/layout: redbox_item_frame.xml
Only in fromBuild/res/layout: redbox_item_title.xml
Only in fromBuild/res/layout: redbox_view.xml
Binary files fromBuild/res/layout/select_dialog_item_material.xml and fromOfficial/res/layout/select_dialog_item_material.xml differ
Binary files fromBuild/res/layout/select_dialog_multichoice_material.xml and fromOfficial/res/layout/select_dialog_multichoice_material.xml differ
Binary files fromBuild/res/layout/select_dialog_singlechoice_material.xml and fromOfficial/res/layout/select_dialog_singlechoice_material.xml differ
Only in fromBuild/res/layout: simple_spinner_dropdown_item.xml
Only in fromBuild/res/layout: simple_spinner_item.xml
Only in fromOfficial/res/layout: splash_layout.xml
Binary files fromBuild/res/layout/splash_screen_view.xml and fromOfficial/res/layout/splash_screen_view.xml differ
Binary files fromBuild/res/layout/support_simple_spinner_dropdown_item.xml and fromOfficial/res/layout/support_simple_spinner_dropdown_item.xml differ
Binary files fromBuild/res/layout/surface_view.xml and fromOfficial/res/layout/surface_view.xml differ
Only in fromBuild/res/layout: test_action_chip.xml
Only in fromBuild/res/layout: test_chip_zero_corner_radius.xml
Only in fromBuild/res/layout: test_design_checkbox.xml
Only in fromBuild/res/layout: test_design_radiobutton.xml
Only in fromBuild/res/layout: test_exposed_dropdown_menu.xml
Only in fromBuild/res/layout: test_navigation_bar_item_layout.xml
Only in fromBuild/res/layout: test_reflow_chipgroup.xml
Only in fromBuild/res/layout: test_toolbar_custom_background.xml
Only in fromBuild/res/layout: test_toolbar_elevation.xml
Only in fromBuild/res/layout: test_toolbar_surface.xml
Only in fromBuild/res/layout: test_toolbar.xml
Only in fromOfficial/res/layout: texture_view.xml
Only in fromBuild/res/layout: text_view_with_line_height_from_appearance.xml
Only in fromBuild/res/layout: text_view_with_line_height_from_layout.xml
Only in fromBuild/res/layout: text_view_with_line_height_from_style.xml
Only in fromBuild/res/layout: text_view_without_line_height.xml
Only in fromBuild/res/layout: text_view_with_theme_line_height.xml
Only in fromOfficial/res/layout: vlc_video_layout.xml
Only in fromOfficial/res/layout: widget_activity.xml
Only in fromOfficial/res/layout: zxing_barcode_scanner.xml
Only in fromOfficial/res/layout: zxing_capture.xml
Only in fromBuild/res: layout-land
Only in fromBuild/res: layout-ldrtl-v17
Only in fromBuild/res: layout-sw600dp-v13
Only in fromBuild/res: layout-v14
Binary files fromBuild/res/layout-v21/notification_action_tombstone.xml and fromOfficial/res/layout-v21/notification_action_tombstone.xml differ
Binary files fromBuild/res/layout-v21/notification_action.xml and fromOfficial/res/layout-v21/notification_action.xml differ
Binary files fromBuild/res/layout-v21/notification_template_custom_big.xml and fromOfficial/res/layout-v21/notification_template_custom_big.xml differ
Binary files fromBuild/res/layout-v21/notification_template_icon_group.xml and fromOfficial/res/layout-v21/notification_template_icon_group.xml differ
Binary files fromBuild/res/layout-v26/abc_screen_toolbar.xml and fromOfficial/res/layout-v26/abc_screen_toolbar.xml differ
Only in fromBuild/res/layout-v26: mtrl_calendar_month.xml
Binary files fromBuild/res/layout-watch-v20/abc_alert_dialog_button_bar_material.xml and fromOfficial/res/layout-watch-v20/abc_alert_dialog_button_bar_material.xml differ
Binary files fromBuild/res/layout-watch-v20/abc_alert_dialog_title_material.xml and fromOfficial/res/layout-watch-v20/abc_alert_dialog_title_material.xml differ
Only in fromOfficial/res: mipmap-anydpi-v26
Only in fromBuild/res/mipmap-hdpi-v4: ic_launcher_beta.png
Only in fromBuild/res/mipmap-hdpi-v4: ic_launcher_beta_round.png
Only in fromBuild/res/mipmap-hdpi-v4: ic_launcher_foreground.png
Only in fromOfficial/res/mipmap-hdpi-v4: ic_launcher_foreground.webp
Only in fromBuild/res/mipmap-hdpi-v4: ic_launcher.png
Only in fromBuild/res/mipmap-hdpi-v4: ic_launcher_round.png
Only in fromOfficial/res/mipmap-hdpi-v4: ic_launcher_round.webp
Only in fromBuild/res/mipmap-mdpi-v4: edge_logo_hollow.png
Only in fromBuild/res/mipmap-mdpi-v4: ic_launcher_beta.png
Only in fromBuild/res/mipmap-mdpi-v4: ic_launcher_beta_round.png
Only in fromBuild/res/mipmap-mdpi-v4: ic_launcher_foreground.png
Only in fromOfficial/res/mipmap-mdpi-v4: ic_launcher_foreground.webp
Only in fromBuild/res/mipmap-mdpi-v4: ic_launcher.png
Only in fromBuild/res/mipmap-mdpi-v4: ic_launcher_round.png
Only in fromOfficial/res/mipmap-mdpi-v4: ic_launcher_round.webp
Only in fromBuild/res/mipmap-xhdpi-v4: ic_launcher_beta.png
Only in fromBuild/res/mipmap-xhdpi-v4: ic_launcher_beta_round.png
Only in fromBuild/res/mipmap-xhdpi-v4: ic_launcher_foreground.png
Only in fromOfficial/res/mipmap-xhdpi-v4: ic_launcher_foreground.webp
Only in fromBuild/res/mipmap-xhdpi-v4: ic_launcher.png
Only in fromBuild/res/mipmap-xhdpi-v4: ic_launcher_round.png
Only in fromOfficial/res/mipmap-xhdpi-v4: ic_launcher_round.webp
Only in fromBuild/res/mipmap-xxhdpi-v4: ic_launcher_beta.png
Only in fromBuild/res/mipmap-xxhdpi-v4: ic_launcher_beta_round.png
Only in fromBuild/res/mipmap-xxhdpi-v4: ic_launcher_foreground.png
Only in fromOfficial/res/mipmap-xxhdpi-v4: ic_launcher_foreground.webp
Only in fromBuild/res/mipmap-xxhdpi-v4: ic_launcher.png
Only in fromBuild/res/mipmap-xxhdpi-v4: ic_launcher_round.png
Only in fromOfficial/res/mipmap-xxhdpi-v4: ic_launcher_round.webp
Only in fromBuild/res/mipmap-xxxhdpi-v4: ic_launcher_beta.png
Only in fromBuild/res/mipmap-xxxhdpi-v4: ic_launcher_beta_round.png
Only in fromBuild/res/mipmap-xxxhdpi-v4: ic_launcher_foreground.png
Only in fromOfficial/res/mipmap-xxxhdpi-v4: ic_launcher_foreground.webp
Only in fromBuild/res/mipmap-xxxhdpi-v4: ic_launcher.png
Only in fromBuild/res/mipmap-xxxhdpi-v4: ic_launcher_round.png
Only in fromOfficial/res/mipmap-xxxhdpi-v4: ic_launcher_round.webp
Only in fromBuild/res/raw: audio_received.mp3
Only in fromBuild/res/raw: audio_sent.mp3
Only in fromBuild/res/raw: firebase_common_keep.xml
Only in fromOfficial/res/raw: zxing_beep.ogg
Only in fromBuild/res/xml: file_provider_paths.xml
Only in fromBuild/res/xml: file_system_provider_paths.xml
Only in fromOfficial/res/xml: flutter_share_file_paths.xml
Only in fromBuild/res/xml: imagepicker_provider_paths.xml
Only in fromOfficial/res/xml: image_share_filepaths.xml
Only in fromOfficial/res/xml: locales_config.xml
Only in fromBuild/res/xml: provider_paths.xml
Only in fromBuild/res/xml: rn_dev_preferences.xml
Only in fromBuild/res/xml: share_download_paths.xml
Binary files fromBuild/res/xml/splits0.xml and fromOfficial/res/xml/splits0.xml differ
Only in fromBuild/res/xml: standalone_badge_gravity_bottom_end.xml
Only in fromBuild/res/xml: standalone_badge_gravity_bottom_start.xml
Only in fromBuild/res/xml: standalone_badge_gravity_top_start.xml
Only in fromBuild/res/xml: standalone_badge_offset.xml
Only in fromBuild/res/xml: standalone_badge.xml
Binary files fromBuild/resources.arsc and fromOfficial/resources.arsc differ
Only in fromBuild: review.properties
Only in fromBuild: service.proto
Only in fromBuild: src
Only in fromOfficial: stamp-cert-sha256
keraliss@keraliss:~/projects/walletScrutiny_build/edgesecure$
```

**Conclusion**:
The EdgeSecure Wallet build was successful, but the discrepancies between the generated APK and the official version indicate that additional investigation is required. The wallet is **not verifiable** at this time.


**Update 2024-07-19**: 

This review is for version 4.8.0. It has an app hash value of 8cd6a12e3dc595964fabcbe82341e28f4a2a4ac6a347fcbead488b76faa7e186.

1. Using a modified version of Emanuel's [script (for 3.6.0)](https://github.com/EdgeApp/edge-react-gui/issues/1748#issuecomment-1518387292), we successfully built the app. 

2. We then ran: `$ aapt dump badging app-release-universal.apk | grep version*`

    This resulted in: 

      ```
      package: name='co.edgesecure.app' versionCode='24062402' versionName='4.8.0' compileSdkVersion='34' compileSdkVersionCodename='14'
      ```

3. We ran the same command on the apk we got from our phone (official) `$ aapt dump badging co.edgesecure.app_v24062402.apk | grep 'package\|version'`
 
    This gave: 

      ```
      package: name='co.edgesecure.app' versionCode='24062402' versionName='4.8.0' compileSdkVersion='34' compileSdkVersionCodename='14'
      ```
4. Next, we created directories for app-release-universal.apk (built) and co.edgesecure.app_v24062402.apk (official) and unzipped their contents, using the unzip command. We then ran a diff, and this was the result:

    ```
    $ diff -r built official/
    Binary files built/AndroidManifest.xml and official/AndroidManifest.xml differ
    Binary files built/assets/dexopt/baseline.prof and official/assets/dexopt/baseline.prof differ
    Binary files built/assets/dexopt/baseline.profm and official/assets/dexopt/baseline.profm differ
    Binary files built/assets/index.android.bundle and official/assets/index.android.bundle differ
    diff -r built/assets/sentry-debug-meta.properties official/assets/sentry-debug-meta.properties
    2c2,3
    < #Fri Jul 19 08:33:47 UTC 2024
    ---
    > #Mon Jun 24 19:12:34 PDT 2024
    > io.sentry.bundle-ids=a7dbdc5d-ac94-4540-92de-097feba6c718
    Binary files built/classes2.dex and official/classes2.dex differ
    Binary files built/classes3.dex and official/classes3.dex differ
    Binary files built/classes4.dex and official/classes4.dex differ
    Binary files built/classes.dex and official/classes.dex differ
    Binary files built/lib/arm64-v8a/libedge-core-jni.so and official/lib/arm64-v8a/libedge-core-jni.so differ
    Binary files built/lib/arm64-v8a/libexpo-modules-core.so and official/lib/arm64-v8a/libexpo-modules-core.so differ
    Binary files built/lib/arm64-v8a/libmymonero-jni.so and official/lib/arm64-v8a/libmymonero-jni.so differ
    Binary files built/lib/arm64-v8a/libreanimated.so and official/lib/arm64-v8a/libreanimated.so differ
    Binary files built/lib/arm64-v8a/librnscreens.so and official/lib/arm64-v8a/librnscreens.so differ
    Binary files built/lib/armeabi-v7a/libedge-core-jni.so and official/lib/armeabi-v7a/libedge-core-jni.so differ
    Binary files built/lib/armeabi-v7a/libexpo-modules-core.so and official/lib/armeabi-v7a/libexpo-modules-core.so differ
    Binary files built/lib/armeabi-v7a/libmymonero-jni.so and official/lib/armeabi-v7a/libmymonero-jni.so differ
    Binary files built/lib/armeabi-v7a/libreanimated.so and official/lib/armeabi-v7a/libreanimated.so differ
    Binary files built/lib/armeabi-v7a/librnscreens.so and official/lib/armeabi-v7a/librnscreens.so differ
    Binary files built/lib/x86/libedge-core-jni.so and official/lib/x86/libedge-core-jni.so differ
    Binary files built/lib/x86/libexpo-modules-core.so and official/lib/x86/libexpo-modules-core.so differ
    Binary files built/lib/x86/libmymonero-jni.so and official/lib/x86/libmymonero-jni.so differ
    Binary files built/lib/x86/libreanimated.so and official/lib/x86/libreanimated.so differ
    Binary files built/lib/x86/librnscreens.so and official/lib/x86/librnscreens.so differ
    Binary files built/lib/x86_64/libedge-core-jni.so and official/lib/x86_64/libedge-core-jni.so differ
    Binary files built/lib/x86_64/libexpo-modules-core.so and official/lib/x86_64/libexpo-modules-core.so differ
    Binary files built/lib/x86_64/libmymonero-jni.so and official/lib/x86_64/libmymonero-jni.so differ
    Binary files built/lib/x86_64/libreanimated.so and official/lib/x86_64/libreanimated.so differ
    Binary files built/lib/x86_64/librnscreens.so and official/lib/x86_64/librnscreens.so differ
    Binary files built/resources.arsc and official/resources.arsc differ
    ```

5. As an additional step, we ran `$ apktool d` on each, outputted in separate directories. 

6. We then ran $ diff -r on the folders with the decompiled apks and [posted it on pastebin](https://pastebin.com/CCzxRWVa)

Version 4.8.0 is evidently **not-verifiable**

**Update 2023-10-31**: Our latest issue was not addressed by the provider but
Emanuel had managed to compile a prior version of this app. Let's see how it
goes for version `3.20.0`:

Emanuel had managed to build the prior version using

```
$ podman build --rm -t edge_build_apk -f scripts/test/container/co.edgesecure.app
```

but here, this resulted repeatedly in different errors:

```
FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':react-native-haptic-feedback'.
> java.util.concurrent.ExecutionException: org.gradle.api.GradleException: Failed to create Jar file /home/appuser/.gradle/caches/jars-9/04d45982efaf99f21af92706e55e06a4/sdk-common-26.0.0.jar.

Deprecated Gradle features were used in this build, making it incompatible with Gradle 8.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

See https://docs.gradle.org/7.5.1/userguide/command_line_interface.html#sec:command_line_warnings
5 actionable tasks: 5 executed

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 17m 17s
Error: error building at STEP "RUN set -ex;      cd /Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/android/ ;      ./gradlew packageReleaseUniversalApk": error while running runtime: exit status 1
```

or

```
FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':react-native-haptic-feedback'.
> java.util.concurrent.ExecutionException: org.gradle.api.UncheckedIOException: Failed to create receipt for instrumented classpath file 'f2b464732555e5b93522a12e9f7cd898/manifest-merger-26.0.0.jar'.

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.

* Get more help at https://help.gradle.org

Deprecated Gradle features were used in this build, making it incompatible with Gradle 8.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

See https://docs.gradle.org/7.5.1/userguide/command_line_interface.html#sec:command_line_warnings

BUILD FAILED in 8m 35s
5 actionable tasks: 5 executed
Error: error building at STEP "RUN set -ex;      cd /Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/android/ ;      ./gradlew clean": error while running runtime: exit status 1
```

or

```
FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':react-native-screens'.
> Could not resolve all files for configuration ':react-native-screens:classpath'.
   > Could not download gradle-4.2.2.jar (com.android.tools.build:gradle:4.2.2)
      > Could not get resource 'https://dl.google.com/dl/android/maven2/com/android/tools/build/gradle/4.2.2/gradle-4.2.2.jar'.
         > java.io.IOException: No file descriptors available
   > Could not download builder-4.2.2.jar (com.android.tools.build:builder:4.2.2)
      > Could not get resource 'https://dl.google.com/dl/android/maven2/com/android/tools/build/builder/4.2.2/builder-4.2.2.jar'.
         > java.io.IOException: No file descriptors available
```

That latter one looks like an issue with the internet connection. Anyway. We
tried to go step by step. Omitting the very verbose bulk of the output, here are
the commands we ran to obtain an apk:

```
$ podman run -it --rm --volume $PWD:/mnt frolvlad/alpine-glibc sh
/ # apk update
/ # apk add --no-cache \
   git \
   npm \
   yarn \
   openjdk11
/ # adduser -D appuser
/ # mkdir -p "/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/"
/ # chown -R appuser:appuser /Users/
/ # su - appuser
a77152952cd1:/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/android$ export NODE_ENV="development" \
     ANDROID_SDK_ROOT="/home/appuser/sdk/" \
     ANDROID_HOME="/home/appuser/sdk/" \
     AIRBITZ_API_KEY="74591cbad4a4938e0049c9d90d4e24091e0d4070" \
     BUGSNAG_API_KEY="5aca2dbe708503471d8137625e092675"
a77152952cd1:~$ mkdir -p "/home/appuser/sdk/licenses"
a77152952cd1:~$ printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/home/appuser/sdk/licenses/android-sdk-license"
a77152952cd1:~$ cd /Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/
a77152952cd1:/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master$ git clone --branch v3.20.0 --depth 1 --no-tags --single-branch https://github.com/EdgeApp/edge-react-gui/ .
a77152952cd1:/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master$ yarnpkg install --frozen-lockfile --ignore-scripts
a77152952cd1:/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master$ yarnpkg prepare
a77152952cd1:/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master$ cd /Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/android/
a77152952cd1:/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/android$ ./gradlew packageReleaseUniversalApk
...
BUILD SUCCESSFUL in 18m 17s
965 actionable tasks: 965 executed
a77152952cd1:/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/android$ exit
/ # cp /Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/android/app/build/outputs/universal_apk/release/app-release-universal.apk /mnt/
```

Notice, we also tried running what the
[build instructions](https://github.com/EdgeApp/edge-react-gui#android-1) say:

```
> Task :app:bugsnagReleaseReleaseTask FAILED
Bugsnag: Uploading to Releases API
{"errors":["API key not recognised: a0000000000000000000000000000000"],"status":"error"}

> Task :app:createReleaseApkListingFileRedirect

FAILURE: Build failed with an exception.
```

but that fails because the application of the API keys was omitted. Emanuel had
patched the source with the provider's API key but I prefer not to upload stuff
to their Bugsnag account or generally to patch the source to make it
reproducible, so I will leave it at this and go with the build result from
above.

With the apk from our build and the apk from Google Play in the same folder:

```
$ unzip -d fromGoogle Edge\ 3.20.0\ \(co.edgesecure.app\).apk 
$ unzip -d fromBuild app-release-universal.apk 
$ diff --recursive from*
Binary files fromBuild/AndroidManifest.xml and fromGoogle/AndroidManifest.xml differ
Only in fromGoogle/assets: dexopt
Binary files fromBuild/assets/index.android.bundle and fromGoogle/assets/index.android.bundle differ
Binary files fromBuild/classes.dex and fromGoogle/classes.dex differ
Binary files fromBuild/lib/arm64-v8a/libedge-core-jni.so and fromGoogle/lib/arm64-v8a/libedge-core-jni.so differ
Binary files fromBuild/lib/arm64-v8a/libmymonero-jni.so and fromGoogle/lib/arm64-v8a/libmymonero-jni.so differ
Binary files fromBuild/lib/arm64-v8a/libreanimated.so and fromGoogle/lib/arm64-v8a/libreanimated.so differ
Binary files fromBuild/lib/armeabi-v7a/libedge-core-jni.so and fromGoogle/lib/armeabi-v7a/libedge-core-jni.so differ
Binary files fromBuild/lib/armeabi-v7a/libmymonero-jni.so and fromGoogle/lib/armeabi-v7a/libmymonero-jni.so differ
Binary files fromBuild/lib/armeabi-v7a/libreanimated.so and fromGoogle/lib/armeabi-v7a/libreanimated.so differ
Binary files fromBuild/lib/x86/libedge-core-jni.so and fromGoogle/lib/x86/libedge-core-jni.so differ
Binary files fromBuild/lib/x86/libmymonero-jni.so and fromGoogle/lib/x86/libmymonero-jni.so differ
Binary files fromBuild/lib/x86/libreanimated.so and fromGoogle/lib/x86/libreanimated.so differ
Binary files fromBuild/lib/x86_64/libedge-core-jni.so and fromGoogle/lib/x86_64/libedge-core-jni.so differ
Binary files fromBuild/lib/x86_64/libmymonero-jni.so and fromGoogle/lib/x86_64/libmymonero-jni.so differ
Binary files fromBuild/lib/x86_64/libreanimated.so and fromGoogle/lib/x86_64/libreanimated.so differ
Binary files fromBuild/resources.arsc and fromGoogle/resources.arsc differ
$ sha256sum Edge\ 3.20.0\ \(co.edgesecure.app\).apk 
115fa7dbd478a0812048d416c94766e1bf548517a4960cf035225946fec50d0b  Edge 3.20.0 (co.edgesecure.app).apk
```

This app is clear **not verifiable**.

## Reveiw 2022-11-02:

Their latest version on Play Store is 2.25.0. The last version we checked did
not match the code. Let's see how it goes now ...

Using [Emanuel's Container file](https://github.com/EdgeApp/edge-react-gui/issues/1748#issuecomment-1065934661)
updated to 2.25.0:

```
...
+ cp /home/appuser/app/edgeUpstreamAPK/res/raw/env.json ./env.json
cp: can't stat '/home/appuser/app/edgeUpstreamAPK/res/raw/env.json': No such file or directory
Error: error building at STEP "RUN set -ex;     cd edge-react-gui;     git checkout v2.25.0;     yarnpkg install --frozen-lockfile --ignore-optional --ignore-scripts;     yarnpkg prepare;     cp /home/appuser/app/edgeUpstreamAPK/res/raw/env.json ./env.json;     cd android;     ./gradlew assembleRelease": error while running runtime: exit status 1
```

ran into an error. The `env.json` configuration file that Emanuel had extracted
from the binary we are trying to test is not in the binary anymore.

After removing that part of the container file, it **fails to build from source**:
  
```
$ podman build --rm -t edge_build_apk -f scripts/test/container/co.edgesecure.app
...
> Task :bugsnag_react-native:compileReleaseKotlin
w: /home/appuser/app/edge/edge-react-gui/node_modules/@bugsnag/react-native/android/src/main/java/com/bugsnag/android/BugsnagReactNative.kt: (204, 48): Elvis operator (?:) always returns the left operand of non-nullable type ReadableMap

> Task :bugsnag_react-native:javaPreCompileRelease
> Task :disklet:generateReleaseBuildConfig

> Task :bugsnag_react-native:compileReleaseJavaWithJavac FAILED
/home/appuser/app/edge/edge-react-gui/node_modules/@bugsnag/react-native/android/src/main/java/com/bugsnag/android/BugsnagPackage.java:1: error: cannot access com.bugsnag.android
package com.bugsnag.android;
^
  /home/appuser/.gradle/caches/transforms-3/db229a6e5f4fe0ba69c000c5a66ca523/transformed/swiperefreshlayout-1.0.0-api.jar: No file descriptors available
/home/appuser/app/edge/edge-react-gui/node_modules/@bugsnag/react-native/android/build/generated/source/buildConfig/release/com/bugsnag/reactnative/BuildConfig.java:4: error: cannot access com.bugsnag.reactnative
package com.bugsnag.reactnative;
^
  /home/appuser/.gradle/caches/transforms-3/db229a6e5f4fe0ba69c000c5a66ca523/transformed/swiperefreshlayout-1.0.0-api.jar: No file descriptors available
2 errors

FAILURE: Build failed with an exception.
...
```

This release is **not verifiable**.
