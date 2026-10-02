import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  BackHandler,
  Platform,
  ActivityIndicator,
  AppRegistry
} from 'react-native';
import { registerRootComponent } from 'expo';
import { WebView } from 'react-native-webview';

export default function App() {
  const [serverUrl, setServerUrl] = useState('http://192.168.29.118:3000');
  const [inputUrl, setInputUrl] = useState('http://192.168.29.118:3000');
  const [showConfig, setShowConfig] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);

  const webViewRef = useRef(null);

  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, [canGoBack]);

  const handleReload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleUpdateUrl = () => {
    let formatted = inputUrl.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'http://' + formatted;
    }
    setServerUrl(formatted);
    setInputUrl(formatted);
    setShowConfig(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001730" />

      {/* Top Mobile Bar (Quick Config / Status) */}
      <View style={styles.topBar}>
        <View style={styles.statusIndicator}>
          <View style={styles.greenDot} />
          <Text style={styles.statusText} numberOfLines={1}>
            MediUnify Captain ({serverUrl.replace('http://', '')})
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleReload} style={styles.actionBtn}>
            <Text style={styles.btnText}>↻ Reload</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowConfig(!showConfig)}
            style={[styles.actionBtn, styles.configBtn]}
          >
            <Text style={styles.btnText}>{showConfig ? '✕' : '⚙ IP'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Optional IP Config Dropdown */}
      {showConfig && (
        <View style={styles.configContainer}>
          <Text style={styles.configLabel}>Local Dev Server IP:Port</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={inputUrl}
              onChangeText={setInputUrl}
              placeholder="e.g. http://192.168.29.118:3000"
              placeholderTextColor="#94A3B8"
              style={styles.urlInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={handleUpdateUrl} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Connect</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main WebView Container */}
      <View style={styles.webWrapper}>
        <WebView
          ref={webViewRef}
          source={{ uri: serverUrl }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsBackForwardNavigationGestures={true}
          geolocationEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          originWhitelist={['*']}
          mediaCapturePermissionGrantType="grant"
          onPermissionRequest={(event) => {
            if (event?.grant && event?.resources) {
              event.grant(event.resources);
            }
          }}
          onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
        />

        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#00A896" />
            <Text style={styles.loadingText}>Loading MediUnify Captain...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001730',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topBar: {
    backgroundColor: '#001730',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#0A2545',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  configBtn: {
    backgroundColor: '#00A896',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  configContainer: {
    backgroundColor: '#002244',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0A3D80',
  },
  configLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  urlInput: {
    flex: 1,
    backgroundColor: '#001730',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: '#FFFFFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
  },
  saveBtn: {
    backgroundColor: '#00A896',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  webWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F4F7FB',
  },
  webview: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F4F7FB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#002244',
  },
});

registerRootComponent(App);
try {
  AppRegistry.registerComponent('main', () => App);
} catch (e) {
  // Already registered
}
