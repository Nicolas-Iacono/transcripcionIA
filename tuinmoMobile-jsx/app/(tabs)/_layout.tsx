import { router, Tabs } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { IconButton, Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '../context/GlobalAuth';

const TAB_BAR_HEIGHT = 60;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, token } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const menuOpenRef = useRef(false);
  const menuAnim = useRef(new Animated.Value(0)).current;
  const pressScales = useRef([new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]).current;

  const actions = useMemo(
    () =>
      [
        {
          key: 'inquilinos',
          icon: 'account-group' as const,
          color: '#2E7D32',
          route: '/InquilinosPage' as const,
        },
        {
          key: 'propietarios',
          icon: 'home' as const,
          color: '#E91E63',
          route: '/propietariosPage' as const,
        },
        {
          key: 'garantes',
          icon: 'account' as const,
          color: '#1E3A8A',
          route: '/GarantesPage' as const,
        },
      ] as const,
    []
  );

  const iconAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  const openMenu = () => {
    if (menuOpenRef.current) return;
    menuOpenRef.current = true;
    setMenuOpen(true);
    setMenuMounted(true);
    menuAnim.setValue(0);
    iconAnims.forEach((v) => v.setValue(0));

    Animated.parallel([
      Animated.timing(menuAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.stagger(
        70,
        iconAnims.map((v) =>
          Animated.spring(v, {
            toValue: 1,
            useNativeDriver: true,
            damping: 12,
            stiffness: 160,
            mass: 0.7,
          })
        )
      ),
    ]).start();
  };

  const closeMenu = (nextRoute?: (typeof actions)[number]['route']) => {
    if (!menuOpenRef.current) return;
    menuOpenRef.current = false;
    setMenuOpen(false);

    const reversed = [...iconAnims].reverse();
    Animated.parallel([
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.stagger(
        55,
        reversed.map((v) =>
          Animated.timing(v, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          })
        )
      ),
    ]).start(({ finished }) => {
      if (finished) {
        setMenuMounted(false);
        pressScales.forEach((v) => v.setValue(1));
        if (nextRoute) router.push(nextRoute);
      }
    });
  };

  useEffect(() => {
    if (!menuMounted) return;
    return () => {
      iconAnims.forEach((v) => v.stopAnimation());
      menuAnim.stopAnimation();
    };
  }, [iconAnims, menuAnim, menuMounted]);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!isAuthenticated && !token) {
        router.replace('/login');
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, token]);

  const webBackdropBlur =
    Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' } as any)
      : undefined;

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5617A4" />
      </View>
    );
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarShowLabel: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
            tabBarButton: (props) => <HapticTab {...props} onPress={openMenu} />,
          }}
        />
        <Tabs.Screen
          name="PropiedadesScreen"
          options={{
            title: 'Propiedades',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="building.2.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="agenda"
          options={{
            title: 'Agenda',
            tabBarIcon: ({ color }) => (
              <View>
                <IconSymbol size={28} name="calendar" color={color} />
                <View style={styles.dot} />
              </View>
            ),
          }}
        />
      </Tabs>

      {menuMounted && (
        <Portal>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.25] }),
              },
            ]}
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={() => closeMenu()} />
          </Animated.View>

          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.fabRow,
              styles.fabShadow,
              {
                bottom: insets.bottom + TAB_BAR_HEIGHT,
                opacity: menuAnim,
                transform: [
                  {
                    translateY: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }),
                  },
                ],
              },
            ]}
          >
            <BlurView
              pointerEvents="none"
              intensity={35}
              tint="light"
              style={[styles.fabBackground, webBackdropBlur]}
            >
              <View pointerEvents="none" style={styles.fabTint} />
            </BlurView>

            <View
              pointerEvents="box-none"
              style={styles.fabContent}
            >
              {actions.map((a, idx) => (
                (() => {
                  const iconAnim = iconAnims[idx] ?? new Animated.Value(0);
                  const iconTranslateY = iconAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [70, 0],
                    extrapolate: 'clamp',
                  });
                  const iconScale = Animated.multiply(
                    iconAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                      extrapolate: 'clamp',
                    }),
                    pressScales[idx] ?? 1
                  );

                  return (
                <Animated.View
                  key={a.key}
                  style={{
                    transform: [
                      {
                        translateY: menuAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [18 + idx * 6, 0],
                        }),
                      },
                      { translateY: iconTranslateY },
                      {
                        scale: Animated.multiply(
                          menuAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.94, 1],
                          }),
                          iconScale
                        ),
                      },
                    ],
                    opacity: iconAnim,
                  }}
                >
                  <IconButton
                    icon={a.icon}
                    mode="contained"
                    size={40}
                    iconColor="#fff"
                    containerColor={a.color}
                    style={[styles.fab, idx === 1 ? styles.fabCenter : undefined]}
                    onPress={() => {
                      Animated.timing(pressScales[idx]!, {
                        toValue: 1.12,
                        duration: 90,
                        useNativeDriver: true,
                      }).start();
                      setTimeout(() => closeMenu(a.route), 60);
                      setTimeout(() => {
                        Animated.timing(pressScales[idx]!, {
                          toValue: 1,
                          duration: 140,
                          useNativeDriver: true,
                        }).start();
                      }, 120);
                    }}
                  />
                </Animated.View>
                  );
                })()
              ))}
            </View>
          </Animated.View>
        </Portal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#D32F2F',
  },
  fabRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 170,
  },
  fabBackground: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  fabTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  fabShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -6 },
    elevation: 0,
  },
  fabContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 40,
    paddingBottom: 16,
  },
  fab: {
    elevation: 18,
  },
  fabCenter: {
    transform: [{ translateY: -70 }],
  },
});
