import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TextInput as RNTextInput } from 'react-native';
import { IconButton, Menu, Divider, Text } from 'react-native-paper';

interface TextFormat {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignment: 'left' | 'center' | 'right' | 'justify';
  fontFamily: string;
}

interface RichTextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  onFormatChange: (format: TextFormat) => void;
  currentFormat: TextFormat;
}

const FONT_FAMILIES = [
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
];

export default function RichTextEditor({
  value,
  onChangeText,
  onFormatChange,
  currentFormat,
}: RichTextEditorProps) {
  const [fontMenuVisible, setFontMenuVisible] = useState(false);
  const textInputRef = useRef<RNTextInput>(null);

  const toggleFormat = (formatKey: keyof Omit<TextFormat, 'alignment' | 'fontFamily'>) => {
    onFormatChange({
      ...currentFormat,
      [formatKey]: !currentFormat[formatKey],
    });
  };

  const setAlignment = (alignment: TextFormat['alignment']) => {
    onFormatChange({
      ...currentFormat,
      alignment,
    });
  };

  const setFontFamily = (fontFamily: string) => {
    onFormatChange({
      ...currentFormat,
      fontFamily,
    });
    setFontMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbarContent}>
          <Menu
            visible={fontMenuVisible}
            onDismiss={() => setFontMenuVisible(false)}
            anchor={
              <IconButton
                icon="format-font"
                size={20}
                onPress={() => setFontMenuVisible(true)}
                style={styles.toolbarButton}
              />
            }
          >
            {FONT_FAMILIES.map((font) => (
              <Menu.Item
                key={font.value}
                onPress={() => setFontFamily(font.value)}
                title={font.label}
                titleStyle={{ fontFamily: font.value.split(',')[0] }}
              />
            ))}
          </Menu>

          <Divider style={styles.divider} />

          <IconButton
            icon="format-bold"
            size={20}
            iconColor={currentFormat.bold ? '#C22961' : '#666'}
            onPress={() => toggleFormat('bold')}
            style={[styles.toolbarButton, currentFormat.bold && styles.activeButton]}
          />

          <IconButton
            icon="format-italic"
            size={20}
            iconColor={currentFormat.italic ? '#C22961' : '#666'}
            onPress={() => toggleFormat('italic')}
            style={[styles.toolbarButton, currentFormat.italic && styles.activeButton]}
          />

          <IconButton
            icon="format-underline"
            size={20}
            iconColor={currentFormat.underline ? '#C22961' : '#666'}
            onPress={() => toggleFormat('underline')}
            style={[styles.toolbarButton, currentFormat.underline && styles.activeButton]}
          />

          <Divider style={styles.divider} />

          <IconButton
            icon="format-align-left"
            size={20}
            iconColor={currentFormat.alignment === 'left' ? '#C22961' : '#666'}
            onPress={() => setAlignment('left')}
            style={[styles.toolbarButton, currentFormat.alignment === 'left' && styles.activeButton]}
          />

          <IconButton
            icon="format-align-center"
            size={20}
            iconColor={currentFormat.alignment === 'center' ? '#C22961' : '#666'}
            onPress={() => setAlignment('center')}
            style={[styles.toolbarButton, currentFormat.alignment === 'center' && styles.activeButton]}
          />

          <IconButton
            icon="format-align-right"
            size={20}
            iconColor={currentFormat.alignment === 'right' ? '#C22961' : '#666'}
            onPress={() => setAlignment('right')}
            style={[styles.toolbarButton, currentFormat.alignment === 'right' && styles.activeButton]}
          />

          <IconButton
            icon="format-align-justify"
            size={20}
            iconColor={currentFormat.alignment === 'justify' ? '#C22961' : '#666'}
            onPress={() => setAlignment('justify')}
            style={[styles.toolbarButton, currentFormat.alignment === 'justify' && styles.activeButton]}
          />
        </ScrollView>
      </View>

      <View style={styles.editorWrapper}>
        <Text style={styles.fontLabel}>
          {FONT_FAMILIES.find(f => f.value === currentFormat.fontFamily)?.label || 'Times New Roman'}
        </Text>
        <RNTextInput
          ref={textInputRef}
          value={value}
          onChangeText={onChangeText}
          multiline
          style={[
            styles.textInput,
            {
              fontFamily: currentFormat.fontFamily.split(',')[0],
              fontWeight: currentFormat.bold ? 'bold' : 'normal',
              fontStyle: currentFormat.italic ? 'italic' : 'normal',
              textDecorationLine: currentFormat.underline ? 'underline' : 'none',
              textAlign: currentFormat.alignment,
            },
          ]}
          placeholder="Escribe el contrato aquí..."
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    backgroundColor: '#F5F6FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 4,
  },
  toolbarContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
  },
  toolbarButton: {
    margin: 0,
  },
  activeButton: {
    backgroundColor: '#FFE5EF',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  editorWrapper: {
    flex: 1,
    padding: 16,
  },
  fontLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: '#000',
    textAlignVertical: 'top',
  },
});
