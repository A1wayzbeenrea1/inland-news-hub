
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Slider } from '@/components/ui/slider';
import { 
  Typography, 
  Eye, 
  Text, 
  PanelTop, 
  Moon, 
  Sun, 
  Move, 
  ZoomIn, 
  MousePointer, 
  Type, 
  Sparkles 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Accessibility = () => {
  const { toast } = useToast();
  const [textSize, setTextSize] = useState(() => {
    return localStorage.getItem('accessibility_textSize') ? 
      parseInt(localStorage.getItem('accessibility_textSize') || '100') : 100;
  });
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('accessibility_highContrast') === 'true';
  });
  const [reduceMotion, setReduceMotion] = useState(() => {
    return localStorage.getItem('accessibility_reduceMotion') === 'true';
  });
  const [lineSpacing, setLineSpacing] = useState(() => {
    return localStorage.getItem('accessibility_lineSpacing') ? 
      parseInt(localStorage.getItem('accessibility_lineSpacing') || '1') : 1;
  });
  const [colorScheme, setColorScheme] = useState(() => {
    return localStorage.getItem('accessibility_colorScheme') || 'default';
  });
  const [cursorSize, setCursorSize] = useState(() => {
    return localStorage.getItem('accessibility_cursorSize') || 'default';
  });
  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem('accessibility_fontFamily') || 'default';
  });
  const [focusHighlight, setFocusHighlight] = useState(() => {
    return localStorage.getItem('accessibility_focusHighlight') === 'true';
  });
  const [imageAltText, setImageAltText] = useState(() => {
    return localStorage.getItem('accessibility_imageAltText') === 'true';
  });

  useEffect(() => {
    // Apply text size
    document.documentElement.style.setProperty('--text-size-factor', `${textSize / 100}`);
    localStorage.setItem('accessibility_textSize', textSize.toString());

    // Apply high contrast
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('accessibility_highContrast', highContrast.toString());

    // Apply reduce motion
    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
    localStorage.setItem('accessibility_reduceMotion', reduceMotion.toString());

    // Apply line spacing
    document.documentElement.style.setProperty('--line-spacing-factor', lineSpacing.toString());
    localStorage.setItem('accessibility_lineSpacing', lineSpacing.toString());

    // Apply color scheme
    document.body.className = document.body.className.replace(/color-scheme-\w+/g, '');
    if (colorScheme !== 'default') {
      document.body.classList.add(`color-scheme-${colorScheme}`);
    }
    localStorage.setItem('accessibility_colorScheme', colorScheme);

    // Apply cursor size
    document.body.className = document.body.className.replace(/cursor-size-\w+/g, '');
    if (cursorSize !== 'default') {
      document.body.classList.add(`cursor-size-${cursorSize}`);
    }
    localStorage.setItem('accessibility_cursorSize', cursorSize);

    // Apply font family
    document.documentElement.style.setProperty('--font-family-preference', fontFamily === 'default' ? 'inherit' : fontFamily);
    localStorage.setItem('accessibility_fontFamily', fontFamily);

    // Apply focus highlight
    if (focusHighlight) {
      document.body.classList.add('enhanced-focus');
    } else {
      document.body.classList.remove('enhanced-focus');
    }
    localStorage.setItem('accessibility_focusHighlight', focusHighlight.toString());

    // Apply image alt text display
    if (imageAltText) {
      document.body.classList.add('show-alt-text');
    } else {
      document.body.classList.remove('show-alt-text');
    }
    localStorage.setItem('accessibility_imageAltText', imageAltText.toString());
    
  }, [textSize, highContrast, reduceMotion, lineSpacing, colorScheme, cursorSize, fontFamily, focusHighlight, imageAltText]);

  const resetSettings = () => {
    setTextSize(100);
    setHighContrast(false);
    setReduceMotion(false);
    setLineSpacing(1);
    setColorScheme('default');
    setCursorSize('default');
    setFontFamily('default');
    setFocusHighlight(false);
    setImageAltText(false);
    
    toast({
      title: "Settings Reset",
      description: "All accessibility settings have been reset to default values.",
    });
  };

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your accessibility preferences have been saved.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Accessibility Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text Size */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ZoomIn className="h-5 w-5" />
                Text Size
              </CardTitle>
              <CardDescription>
                Adjust the size of text throughout the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-2">
                <Text className="h-4 w-4" />
                <Slider
                  value={[textSize]}
                  min={75}
                  max={200}
                  step={5}
                  onValueChange={(value) => setTextSize(value[0])}
                  className="flex-1"
                />
                <Text className="h-6 w-6" />
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Current size: {textSize}%
              </div>
              <div className="mt-4 p-3 border rounded-md" style={{ fontSize: `${textSize}%` }}>
                This is a preview of your selected text size.
              </div>
            </CardContent>
          </Card>

          {/* Contrast Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Visual Settings
              </CardTitle>
              <CardDescription>
                Adjust contrast and visual preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">High Contrast</label>
                  <p className="text-xs text-gray-500">Increase contrast for better readability</p>
                </div>
                <Switch 
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Color Scheme</label>
                <Select value={colorScheme} onValueChange={setColorScheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                    <SelectItem value="light">Light Mode</SelectItem>
                    <SelectItem value="sepia">Sepia</SelectItem>
                    <SelectItem value="grayscale">Grayscale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Reduce Motion</label>
                  <p className="text-xs text-gray-500">Minimize animations and motion effects</p>
                </div>
                <Switch 
                  checked={reduceMotion}
                  onCheckedChange={setReduceMotion}
                />
              </div>
            </CardContent>
          </Card>

          {/* Reading Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Typography className="h-5 w-5" />
                Reading Preferences
              </CardTitle>
              <CardDescription>
                Customize your reading experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Line Spacing</label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs">Compact</span>
                  <RadioGroup 
                    className="flex space-x-2" 
                    value={lineSpacing.toString()}
                    onValueChange={(value) => setLineSpacing(parseInt(value))}
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="1" id="spacing-1" />
                      <label htmlFor="spacing-1" className="text-xs">1</label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="1.5" id="spacing-1.5" />
                      <label htmlFor="spacing-1.5" className="text-xs">1.5</label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="2" id="spacing-2" />
                      <label htmlFor="spacing-2" className="text-xs">2</label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="2.5" id="spacing-2.5" />
                      <label htmlFor="spacing-2.5" className="text-xs">2.5</label>
                    </div>
                  </RadioGroup>
                  <span className="text-xs">Spacious</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Font Family</label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a font family" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="sans-serif">Sans-serif</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                    <SelectItem value="dyslexic">Dyslexic Friendly</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-3 p-3 border rounded-md" style={{ fontFamily: fontFamily === 'default' ? 'inherit' : fontFamily }}>
                  This is a preview of the selected font family.
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Show Image Alt Text</label>
                  <p className="text-xs text-gray-500">Display alternative text descriptions for images</p>
                </div>
                <Switch 
                  checked={imageAltText}
                  onCheckedChange={setImageAltText}
                />
              </div>
            </CardContent>
          </Card>

          {/* Navigation and Focus */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                Navigation & Focus
              </CardTitle>
              <CardDescription>
                Adjust pointer and keyboard navigation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Cursor Size</label>
                <Select value={cursorSize} onValueChange={setCursorSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cursor size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="extra-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Enhanced Focus Indicators</label>
                  <p className="text-xs text-gray-500">Make focus outlines more visible</p>
                </div>
                <Switch 
                  checked={focusHighlight}
                  onCheckedChange={setFocusHighlight}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={resetSettings}>
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings}>
            Save Preferences
          </Button>
        </div>

        <div className="mt-12 bg-muted/50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Accessibility Statement</h2>
          <p className="mb-4">
            The Inland Empire News Hub is committed to ensuring digital accessibility for people with disabilities. 
            We are continually improving the user experience for everyone, and applying the relevant accessibility standards.
          </p>
          <p className="mb-4">
            We welcome your feedback on the accessibility of this website. Please let us know if you encounter any 
            barriers or have suggestions for improvement:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Email: accessibility@inlandempirenewshub.com</li>
            <li>Phone: (909) 300-7596</li>
          </ul>
          <p>
            This site aims to comply with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Accessibility;
