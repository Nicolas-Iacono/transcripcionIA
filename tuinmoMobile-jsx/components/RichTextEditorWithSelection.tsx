import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TextInput as RNTextInput, Alert } from 'react-native';
import { IconButton, Menu, Divider } from 'react-native-paper';

interface RichTextEditorWithSelectionProps {
  value: string;
  onChangeText: (text: string) => void;
}

const FONT_FAMILIES = [
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Verdana', value: 'Verdana' },
];

export default function RichTextEditorWithSelection({
  value,
  onChangeText,
}: RichTextEditorWithSelectionProps) {
  const [fontMenuVisible, setFontMenuVisible] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const textInputRef = useRef<RNTextInput>(null);

  const applyFormat = (tag: string, style?: string) => {
    const { start, end } = selection;
    
    if (start === end) {
      Alert.alert('Selecciona texto', 'Por favor selecciona el texto que deseas formatear');
      return;
    }

    const before = value.substring(0, start);
    const selectedText = value.substring(start, end);
    const after = value.substring(end);

    let formattedText = '';
    
    switch (tag) {
      case 'b':
        formattedText = `${before}<b>${selectedText}</b>${after}`;
        break;
      case 'i':
        formattedText = `${before}<i>${selectedText}</i>${after}`;
        break;
      case 'u':
        formattedText = `${before}<u>${selectedText}</u>${after}`;
        break;
      case 'font':
        formattedText = `${before}<span style="font-family: ${style}">${selectedText}</span>${after}`;
        break;
      case 'align-left':
        formattedText = `${before}<p style="text-align: left">${selectedText}</p>${after}`;
        break;
      case 'align-center':
        formattedText = `${before}<p style="text-align: center">${selectedText}</p>${after}`;
        break;
      case 'align-right':
        formattedText = `${before}<p style="text-align: right">${selectedText}</p>${after}`;
        break;
      case 'align-justify':
        formattedText = `${before}<p style="text-align: justify">${selectedText}</p>${after}`;
        break;
      default:
        formattedText = value;
    }

    onChangeText(formattedText);
  };

  const handleSelectionChange = (event: any) => {
    setSelection(event.nativeEvent.selection);
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
                onPress={() => {
                  applyFormat('font', font.value);
                  setFontMenuVisible(false);
                }}
                title={font.label}
              />
            ))}
          </Menu>

          <Divider style={styles.divider} />

          <IconButton
            icon="format-bold"
            size={20}
            onPress={() => applyFormat('b')}
            style={styles.toolbarButton}
          />

          <IconButton
            icon="format-italic"
            size={20}
            onPress={() => applyFormat('i')}
            style={styles.toolbarButton}
          />

          <IconButton
            icon="format-underline"
            size={20}
            onPress={() => applyFormat('u')}
            style={styles.toolbarButton}
          />

          <Divider style={styles.divider} />

          <IconButton
            icon="format-align-left"
            size={20}
            onPress={() => applyFormat('align-left')}
            style={styles.toolbarButton}
          />

          <IconButton
            icon="format-align-center"
            size={20}
            onPress={() => applyFormat('align-center')}
            style={styles.toolbarButton}
          />

          <IconButton
            icon="format-align-right"
            size={20}
            onPress={() => applyFormat('align-right')}
            style={styles.toolbarButton}
          />

          <IconButton
            icon="format-align-justify"
            size={20}
            onPress={() => applyFormat('align-justify')}
            style={styles.toolbarButton}
          />
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.editorWrapper}
        contentContainerStyle={styles.editorContent}
        keyboardShouldPersistTaps="handled"
      >
        <RNTextInput
          ref={textInputRef}
          value={value}
          onChangeText={onChangeText}
          onSelectionChange={handleSelectionChange}
          multiline
          style={styles.textInput}
          placeholder="Escribe el contrato aquí..."
          placeholderTextColor="#999"
        />
      </ScrollView>
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
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  editorWrapper: {
    flex: 1,
  },
  editorContent: {
    padding: 16,
    flexGrow: 1,
  },
  textInput: {
    fontSize: 13,
    lineHeight: 20,
    color: '#000',
    textAlignVertical: 'top',
    fontFamily: 'Times New Roman',
    minHeight: 500,
  },
});
