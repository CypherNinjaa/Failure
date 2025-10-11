import React, { useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';

const MAIN_WEBSITE = 'https://hcs-edu.vercel.app/';

export default function HomeScreen() {
  const webViewRef = useRef<WebView>(null);

  const handleShouldStartLoadWithRequest = (request: any) => {
    const url = request.url;
    
    // Allow the main website and its pages
    if (url.startsWith(MAIN_WEBSITE)) {
      return true;
    }
    
    // Open external links in the mobile browser
    Linking.openURL(url);
    return false;
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const url = navState.url;
    
    // If navigating away from main website, open in external browser
    if (!url.startsWith(MAIN_WEBSITE) && navState.navigationType === 'click') {
      webViewRef.current?.stopLoading();
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: MAIN_WEBSITE }}
        style={styles.webview}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsBackForwardNavigationGestures={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
