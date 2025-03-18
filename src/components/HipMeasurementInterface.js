import React, { useState, useRef } from 'react';
import { Info, Clipboard, Check } from 'lucide-react';

const HipMeasurementInterface = () => {
  const [copied, setCopied] = useState(false);
  const [measurements, setMeasurements] = useState({
    mri: { right: false, left: false },
    femoralTorsion: { right: '', left: '' },
    tibialTorsion: { right: '', left: '' },
    xrayEOS: { right: false, left: false },
    legLength: { right: '', left: '' },
    ccd: { right: '', left: '' },
    alpha: { right: '', left: '' },
    lce: { right: '', left: '' },
    acetabularIndex: { right: '', left: '' },
    crossingSign: { right: false, left: false },
    ischialSpineSign: { right: false, left: false },
    posteriorWallSign: { right: false, left: false },
    retroversionIndex: { right: '', left: '' },
    crossoverSign: { right: false, left: false }
  });

  const tooltips = {
    femoralTorsion: "Femoral Torsion (nach Murphy): Normal range 10-25°",
    tibialTorsion: "Tibial Torsion (Bimalleolare Method): Normal range 15-30°",
    legLength: "Leg Length: Measurement in millimeters",
    ccd: "Caput-Collum-Diaphyseal angle: Measures neck-shaft angle. Normal: 120-135°, <120° = Coxa vara, >135° = Coxa valga",
    alpha: "Alpha angle: Measures femoral head-neck junction. Normal: <60°, Abnormal: >60°",
    lce: "Lateral Center-Edge angle: Measures lateral coverage of femoral head. Dysplasia: <22°, Normal: 23-33°, Deep hip: 34-39°, Protrusion: >39°",
    acetabularIndex: "Acetabular Index: Measures acetabular roof inclination. Dysplasia: >14°, Normal: 3-13°, Deep hip: -7-2°, Protrusion: <-8°",
    crossingSign: "Crossing Sign: Indicator of acetabular retroversion. Normal: Negative",
    ischialSpineSign: "Ischial Spine Sign: Indicator of acetabular retroversion. Normal: Negative",
    posteriorWallSign: "Posterior Wall Sign: Indicator of acetabular coverage. Normal: Negative",
    retroversionIndex: "Retroversion Index: Percentage of acetabular opening with retroversion. Normal: 0%",
    crossoverSign: "Cross-over sign (figure of 8): Indicator of acetabular retroversion. Normal: Negative"
  };

  const normalRanges = {
    femoralTorsion: { low: 10, high: 25 },
    tibialTorsion: { low: 15, high: 30 },
    ccd: { low: 120, high: 135 },
    alpha: { low: 0, high: 60 },
    lce: { low: 23, high: 33 },
    acetabularIndex: { low: 3, high: 13 },
    retroversionIndex: { low: 0, high: 0 }
  };
  
  const rangeLabels = {
    femoralTorsion: "10-25°",
    tibialTorsion: "15-30°",
    ccd: "120-135°",
    alpha: "<60°",
    lce: "23-33°",
    acetabularIndex: "3-13°",
    retroversionIndex: "0%",
    crossingSign: "Negative",
    ischialSpineSign: "Negative",
    posteriorWallSign: "Negative",
    crossoverSign: "Negative"
  };

  const getRangeStatus = (value, type) => {
    if (!value || !normalRanges[type]) return 'neutral';
    const num = parseFloat(value);
    
    const range = normalRanges[type];
    if (num < range.low) return 'low';
    if (num > range.high) return 'high';
    return 'normal';
  };

  const getBooleanStatus = (value) => {
    if (value === true) return 'abnormal';
    if (value === false) return 'normal';
    return 'neutral';
  };

  const getStatusColor = (status) => {
    const colors = {
      low: 'bg-amber-500/10 border-amber-500/20 text-amber-700',
      high: 'bg-rose-500/10 border-rose-500/20 text-rose-700',
      normal: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700',
      abnormal: 'bg-rose-500/10 border-rose-500/20 text-rose-700',
      neutral: 'bg-slate-500/10 border-slate-500/20 text-slate-700'
    };
    return colors[status] || colors.neutral;
  };

  const handleInputChange = (param, side, value) => {
    setMeasurements(prev => ({
      ...prev,
      [param]: {
        ...prev[param],
        [side]: value
      }
    }));
  };

/// Modern approach using Clipboard API with explicit HTML format
const copyToClipboard = () => {
  // Create rows for our data
  const rows = [
    ['Parameter', 'Rechts', 'Links', 'Referenzbereich'],
    ['MRI', measurements.mri.right ? 'Ja' : 'Nein', measurements.mri.left ? 'Ja' : 'Nein', '-'],
    ['Femorale Torsion (nach Murphy)', measurements.femoralTorsion.right ? `${measurements.femoralTorsion.right}°` : '-', measurements.femoralTorsion.left ? `${measurements.femoralTorsion.left}°` : '-', '10–25°'],
    ['Tibiale Torsion (Bimalleolare Methode)', measurements.tibialTorsion.right ? `${measurements.tibialTorsion.right}°` : '-', measurements.tibialTorsion.left ? `${measurements.tibialTorsion.left}°` : '-', '15–30°'],
    ['Röntgen/EOS', measurements.xrayEOS.right ? 'Ja' : 'Nein', measurements.xrayEOS.left ? 'Ja' : 'Nein', '-'],
    ['Beinlänge', measurements.legLength.right || 'N/A', measurements.legLength.left || 'N/A', '-'],
    ['CCD-Winkel', measurements.ccd.right ? `${measurements.ccd.right}°` : '-', measurements.ccd.left ? `${measurements.ccd.left}°` : '-', '120–135°'],
    ['Alpha-Winkel', measurements.alpha.right ? `${measurements.alpha.right}°` : '-', measurements.alpha.left ? `${measurements.alpha.left}°` : '-', '<60°'],
    ['LCE-Winkel', measurements.lce.right ? `${measurements.lce.right}°` : '-', measurements.lce.left ? `${measurements.lce.left}°` : '-', '23–33°'],
    ['Azetabulärer Index', measurements.acetabularIndex.right ? `${measurements.acetabularIndex.right}°` : '-', measurements.acetabularIndex.left ? `${measurements.acetabularIndex.left}°` : '-', '3–13°'],
    ['Crossing Sign', measurements.crossingSign.right ? 'Ja' : 'Nein', measurements.crossingSign.left ? 'Ja' : 'Nein', 'Nein'],
    ['Ischial Spine Sign', measurements.ischialSpineSign.right ? 'Ja' : 'Nein', measurements.ischialSpineSign.left ? 'Ja' : 'Nein', 'Nein'],
    ['Posterior Wall Sign', measurements.posteriorWallSign.right ? 'Ja' : 'Nein', measurements.posteriorWallSign.left ? 'Ja' : 'Nein', 'Nein'],
    ['Retroversion-Index', measurements.retroversionIndex.right ? `${measurements.retroversionIndex.right}%` : '-', measurements.retroversionIndex.left ? `${measurements.retroversionIndex.left}%` : '-', '0%'],
    ['Cross-over sign (figure of 8)', measurements.crossoverSign.right ? 'Ja' : 'Nein', measurements.crossoverSign.left ? 'Ja' : 'Nein', 'Nein']
  ];

  // Create HTML table with proper Word-compatible styling
  let htmlTable = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">';
  
  // Add header row with bold styling
  htmlTable += '<tr>';
  rows[0].forEach(header => {
    htmlTable += `<th style="background-color: #f2f2f2; font-weight: bold; padding: 8px; border: 1px solid #ddd;">${header}</th>`;
  });
  htmlTable += '</tr>';
  
  // Add data rows
  for (let i = 1; i < rows.length; i++) {
    htmlTable += '<tr>';
    rows[i].forEach((cell, index) => {
      // Make first column (parameter names) bold
      if (index === 0) {
        htmlTable += `<td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">${cell}</td>`;
      } else {
        htmlTable += `<td style="padding: 8px; border: 1px solid #ddd;">${cell}</td>`;
      }
    });
    htmlTable += '</tr>';
  }
  
  htmlTable += '</table>';
  
  // Create plain text version as fallback
  let plainText = '';
  rows.forEach(row => {
    plainText += row.join('\t') + '\n';
  });

  // Use the modern Clipboard API
  if (navigator.clipboard && navigator.clipboard.write) {
    const blob = new Blob([htmlTable], { type: 'text/html' });
    const plainBlob = new Blob([plainText], { type: 'text/plain' });
    
    const data = [
      new ClipboardItem({
        'text/html': blob,
        'text/plain': plainBlob
      })
    ];
    
    navigator.clipboard.write(data)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback to the basic text copy
        navigator.clipboard.writeText(plainText)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
      });
  } else {
    // For browsers that don't support clipboard.write API
    // Use a hidden textarea approach
    const textArea = document.createElement('textarea');
    textArea.value = plainText;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fallback: Copying text failed', err);
    }
    
    document.body.removeChild(textArea);
  }
};

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Hip Radiographic Parameters</h1>
        <p className="text-sm text-slate-400 mt-1">Values highlighted in green are normal, amber indicates low values, red indicates high values</p>
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {copied ? <Check size={18} /> : <Clipboard size={18} />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Parameters */}
          <div className="space-y-6">
            {/* MRI Section */}
            <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4">Imaging Modalities</h2>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium">MRI</label>
                  <span className="text-xs text-slate-400">For torsion measurements, labrum, cartilage, asphericity</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-16 text-right">Right:</span>
                    <input
                      type="checkbox"
                      checked={measurements.mri.right}
                      onChange={(e) => handleInputChange('mri', 'right', e.target.checked)}
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-16 text-right">Left:</span>
                    <input
                      type="checkbox"
                      checked={measurements.mri.left}
                      onChange={(e) => handleInputChange('mri', 'left', e.target.checked)}
                      className="h-5 w-5"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium">Röntgen/EOS</label>
                  <span className="text-xs text-slate-400">Standard AP pelvis, 120cm film-tube distance</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-16 text-right">Right:</span>
                    <input
                      type="checkbox"
                      checked={measurements.xrayEOS.right}
                      onChange={(e) => handleInputChange('xrayEOS', 'right', e.target.checked)}
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-16 text-right">Left:</span>
                    <input
                      type="checkbox"
                      checked={measurements.xrayEOS.left}
                      onChange={(e) => handleInputChange('xrayEOS', 'left', e.target.checked)}
                      className="h-5 w-5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Torsion Measurements */}
            <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4">Torsion Measurements</h2>
              
              {['femoralTorsion', 'tibialTorsion'].map(param => (
                <div key={param} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="font-medium">{param === 'femoralTorsion' ? 'Femoral Torsion' : 'Tibial Torsion'}</label>
                    <div className="relative group">
                      <Info size={16} className="text-slate-400" />
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-64 p-2 bg-slate-700 rounded-md text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        {tooltips[param]}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`flex items-center space-x-2 p-2 rounded-md ${getStatusColor(getRangeStatus(measurements[param].right, param))}`}>
                      <span className="w-16 text-right">Right:</span>
                      <input
                        type="number"
                        value={measurements[param].right}
                        onChange={(e) => handleInputChange(param, 'right', e.target.value)}
                        className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded-md"
                        placeholder="0°"
                      />
                      <span>°</span>
                      <span className="text-xs text-slate-400 ml-2">[{rangeLabels[param]}]</span>
                    </div>
                    <div className={`flex items-center space-x-2 p-2 rounded-md ${getStatusColor(getRangeStatus(measurements[param].left, param))}`}>
                      <span className="w-16 text-right">Left:</span>
                      <input
                        type="number"
                        value={measurements[param].left}
                        onChange={(e) => handleInputChange(param, 'left', e.target.value)}
                        className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded-md"
                        placeholder="0°"
                      />
                      <span>°</span>
                      <span className="text-xs text-slate-400 ml-2">[{rangeLabels[param]}]</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Leg Length */}
            <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4">Leg Length</h2>
                              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <label className="font-medium">Beinlänge</label>
                  <div className="relative group">
                    <Info size={16} className="text-slate-400" />
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-64 p-2 bg-slate-700 rounded-md text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      {tooltips.legLength}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-16 text-right">Right:</span>
                    <input
                      type="text"
                      value={measurements.legLength.right}
                      onChange={(e) => handleInputChange('legLength', 'right', e.target.value)}
                      className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded-md"
                      placeholder="N/A"
                    />
                    <span className="text-xs text-slate-400 ml-2">[mm]</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-16 text-right">Left:</span>
                    <input
                      type="text"
                      value={measurements.legLength.left}
                      onChange={(e) => handleInputChange('legLength', 'left', e.target.value)}
                      className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded-md"
                      placeholder="N/A"
                    />
                    <span className="text-xs text-slate-400 ml-2">[mm]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Hip Measurements */}
          <div className="space-y-6">
            {/* Angular Measurements */}
            <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4">Angular Measurements</h2>
              
              {['ccd', 'alpha', 'lce', 'acetabularIndex'].map(param => (
                <div key={param} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="font-medium">
                      {param === 'ccd' ? 'CCD Angle' : 
                       param === 'alpha' ? 'Alpha Angle' : 
                       param === 'lce' ? 'LCE Angle' : 'Acetabular Index'}
                    </label>
                    <div className="relative group">
                      <Info size={16} className="text-slate-400" />
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-64 p-2 bg-slate-700 rounded-md text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        {tooltips[param]}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`flex items-center space-x-2 p-2 rounded-md ${getStatusColor(getRangeStatus(measurements[param].right, param))}`}>
                      <span className="w-16 text-right">Right:</span>
                      <input
                        type="number"
                        value={measurements[param].right}
                        onChange={(e) => handleInputChange(param, 'right', e.target.value)}
                        className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded-md"
                        placeholder="0°"
                      />
                      <span>°</span>
                    </div>
                    <div className={`flex items-center space-x-2 p-2 rounded-md ${getStatusColor(getRangeStatus(measurements[param].left, param))}`}>
                      <span className="w-16 text-right">Left:</span>
                      <input
                        type="number"
                        value={measurements[param].left}
                        onChange={(e) => handleInputChange(param, 'left', e.target.value)}
                        className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded-md"
                        placeholder="0°"
                      />
                      <span>°</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Signs and Retroversion */}
            <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
              <h2 className="text-xl font-semibold mb-4">Retroversion Indicators</h2>
              
              {['crossingSign', 'ischialSpineSign', 'posteriorWallSign', 'crossoverSign'].map(param => (
                <div key={param} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="font-medium">
                      {param === 'crossingSign' ? 'Crossing Sign' : 
                       param === 'ischialSpineSign' ? 'Ischial Spine Sign' : 
                       param === 'posteriorWallSign' ? 'Posterior Wall Sign' : 
                       'Cross-over Sign (figure of 8)'}
                    </label>
                    <div className="relative group">
                      <Info size={16} className="text-slate-400" />
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-64 p-2 bg-slate-700 rounded-md text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        {tooltips[param]}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`flex items-center space-x-2 p-2 rounded-md ${getStatusColor(getBooleanStatus(measurements[param].right))}`}>
                      <span className="w-16 text-right">Right:</span>
                      <input
                        type="checkbox"
                        checked={measurements[param].right}
                        onChange={(e) => handleInputChange(param, 'right', e.target.checked)}
                        className="h-5 w-5"
                      />
                      <span className="text-xs text-slate-400 ml-2">[Normal: {rangeLabels[param]}]</span>
                    </div>
                    <div className={`flex items-center space-x-2 p-2 rounded-md ${getStatusColor(getBooleanStatus(measurements[param].left))}`}>
                      <span className="w-16 text-right">Left:</span>
                      <input
                        type="checkbox"
                        checked={measurements[param].left}
                        onChange={(e) => handleInputChange(param, 'left', e.target.checked)}
                        className="h-5 w-5"
                      />
                      <span className="text-xs text-slate-400 ml-2">[Normal: {rangeLabels[param]}]</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Retroversion Index */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <label className="font-medium">Retroversion Index</label>
                  <div className="relative group">
                    <Info size={16} className="text-slate-400" />
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-64 p-2 bg-slate-700 rounded-md text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      {tooltips.retroversionIndex}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`flex items-center space-x-2 p-2 rounded-md ${getStatusColor(getRangeStatus(measurements.retroversionIndex.right, 'retroversionIndex'))}`}>
                    <span className="w-16 text-right">Right:</span>
                    <input
                      type="number"
                      value={measurements.retroversionIndex.right}
                      onChange={(e) => handleInputChange('retroversionIndex', 'right', e.target.value)}
                      className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded-md"
                      placeholder="0%"
                    />
                    <span>%</span>
                    <span className="text-xs text-slate-400 ml-2">[{rangeLabels.retroversionIndex}]</span>
                  </div>
                  <div className={`flex items-center space-x-2 p-2 rounded-md ${getStatusColor(getRangeStatus(measurements.retroversionIndex.left, 'retroversionIndex'))}`}>
                    <span className="w-16 text-right">Left:</span>
                    <input
                      type="number"
                      value={measurements.retroversionIndex.left}
                      onChange={(e) => handleInputChange('retroversionIndex', 'left', e.target.value)}
                      className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded-md"
                      placeholder="0%"
                    />
                    <span>%</span>
                    <span className="text-xs text-slate-400 ml-2">[{rangeLabels.retroversionIndex}]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-8 p-6 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Measurement Summary</h2>
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              {copied ? <Check size={18} /> : <Clipboard size={18} />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b border-slate-700">Parameter</th>
                  <th className="text-center p-2 border-b border-slate-700">Rechts</th>
                  <th className="text-center p-2 border-b border-slate-700">Links</th>
                  <th className="text-center p-2 border-b border-slate-700">Referenzbereich</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-b border-slate-700">MRI</td>
                  <td className="text-center p-2 border-b border-slate-700">{measurements.mri.right ? 'Ja' : 'Nein'}</td>
                  <td className="text-center p-2 border-b border-slate-700">{measurements.mri.left ? 'Ja' : 'Nein'}</td>
                  <td className="text-center p-2 border-b border-slate-700">-</td>
                </tr>
                <tr>
                  <td className="p-2 border-b border-slate-700">Femorale Torsion (nach Murphy)</td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getRangeStatus(measurements.femoralTorsion.right, 'femoralTorsion'))}`}>
                    {measurements.femoralTorsion.right ? `${measurements.femoralTorsion.right}°` : '-'}
                  </td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getRangeStatus(measurements.femoralTorsion.left, 'femoralTorsion'))}`}>
                    {measurements.femoralTorsion.left ? `${measurements.femoralTorsion.left}°` : '-'}
                  </td>
                  <td className="text-center p-2 border-b border-slate-700">10–25°</td>
                </tr>
                <tr>
                  <td className="p-2 border-b border-slate-700">Tibiale Torsion (Bimalleolare Methode)</td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getRangeStatus(measurements.tibialTorsion.right, 'tibialTorsion'))}`}>
                    {measurements.tibialTorsion.right ? `${measurements.tibialTorsion.right}°` : '-'}
                  </td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getRangeStatus(measurements.tibialTorsion.left, 'tibialTorsion'))}`}>
                    {measurements.tibialTorsion.left ? `${measurements.tibialTorsion.left}°` : '-'}
                  </td>
                  <td className="text-center p-2 border-b border-slate-700">15–30°</td>
                </tr>
                <tr>
                  <td className="p-2 border-b border-slate-700">Röntgen/EOS</td>
                  <td className="text-center p-2 border-b border-slate-700">{measurements.xrayEOS.right ? 'Ja' : 'Nein'}</td>
                  <td className="text-center p-2 border-b border-slate-700">{measurements.xrayEOS.left ? 'Ja' : 'Nein'}</td>
                  <td className="text-center p-2 border-b border-slate-700">-</td>
                </tr>
                <tr>
                  <td className="p-2 border-b border-slate-700">Beinlänge</td>
                  <td className="text-center p-2 border-b border-slate-700">{measurements.legLength.right || 'N/A'}</td>
                  <td className="text-center p-2 border-b border-slate-700">{measurements.legLength.left || 'N/A'}</td>
                  <td className="text-center p-2 border-b border-slate-700">-</td>
                </tr>
                <tr>
                  <td className="p-2 border-b border-slate-700">CCD-Winkel</td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getRangeStatus(measurements.ccd.right, 'ccd'))}`}>
                    {measurements.ccd.right ? `${measurements.ccd.right}°` : '-'}
                  </td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getRangeStatus(measurements.ccd.left, 'ccd'))}`}>
                    {measurements.ccd.left ? `${measurements.ccd.left}°` : '-'}
                  </td>
                  <td className="text-center p-2 border-b border-slate-700">120–135°</td>
                </tr>
                <tr>
                  <td className="p-2 border-b border-slate-700">Alpha-Winkel</td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getRangeStatus(measurements.alpha.right, 'alpha'))}`}>
                    {measurements.alpha.right ? `${measurements.alpha.right}°` : '-'}
                  </td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getRangeStatus(measurements.alpha.left, 'alpha'))}`}>
                    {measurements.alpha.left ? `${measurements.alpha.left}°` : '-'}
                  </td>
                  <td className="text-center p-2 border-b border-slate-700">&lt;60°</td>
                </tr>
                <tr>
                  <td className="p-2 border-b border-slate-700">LCE-Winkel</td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getRangeStatus(measurements.lce.right, 'lce'))}`}>
                    {measurements.lce.right ? `${measurements.lce.right}°` : '-'}
                  </td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getRangeStatus(measurements.lce.left, 'lce'))}`}>
                    {measurements.lce.left ? `${measurements.lce.left}°` : '-'}
                  </td>
                  <td className="text-center p-2 border-b border-slate-700">23–33°</td>
                </tr>
                <tr>
                  <td className="p-2 border-b border-slate-700">Azetabulärer Index</td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getRangeStatus(measurements.acetabularIndex.right, 'acetabularIndex'))}`}>
                    {measurements.acetabularIndex.right ? `${measurements.acetabularIndex.right}°` : '-'}
                  </td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getRangeStatus(measurements.acetabularIndex.left, 'acetabularIndex'))}`}>
                    {measurements.acetabularIndex.left ? `${measurements.acetabularIndex.left}°` : '-'}
                  </td>
                  <td className="text-center p-2 border-b border-slate-700">3–13°</td>
                </tr>
                <tr>
                  <td className="p-2 border-b border-slate-700">Crossing Sign</td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getBooleanStatus(measurements.crossingSign.right))}`}>
                    {measurements.crossingSign.right ? 'Ja' : 'Nein'}
                  </td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getBooleanStatus(measurements.crossingSign.left))}`}>
                    {measurements.crossingSign.left ? 'Ja' : 'Nein'}
                  </td>
                  <td className="text-center p-2 border-b border-slate-700">Nein</td>
                </tr>
                <tr>
                  <td className="p-2 border-b border-slate-700">Ischial Spine Sign</td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getBooleanStatus(measurements.ischialSpineSign.right))}`}>
                    {measurements.ischialSpineSign.right ? 'Ja' : 'Nein'}
                  </td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getBooleanStatus(measurements.ischialSpineSign.left))}`}>
                    {measurements.ischialSpineSign.left ? 'Ja' : 'Nein'}
                  </td>
                  <td className="text-center p-2 border-b border-slate-700">Nein</td>
                </tr>
                <tr>
                  <td className="p-2 border-b border-slate-700">Posterior Wall Sign</td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getBooleanStatus(measurements.posteriorWallSign.right))}`}>
                    {measurements.posteriorWallSign.right ? 'Ja' : 'Nein'}
                  </td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getBooleanStatus(measurements.posteriorWallSign.left))}`}>
                    {measurements.posteriorWallSign.left ? 'Ja' : 'Nein'}
                  </td>
                  <td className="text-center p-2 border-b border-slate-700">Nein</td>
                </tr>
                <tr>
                  <td className="p-2 border-b border-slate-700">Retroversion-Index</td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getRangeStatus(measurements.retroversionIndex.right, 'retroversionIndex'))}`}>
                    {measurements.retroversionIndex.right ? `${measurements.retroversionIndex.right}%` : '-'}
                  </td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getRangeStatus(measurements.retroversionIndex.left, 'retroversionIndex'))}`}>
                    {measurements.retroversionIndex.left ? `${measurements.retroversionIndex.left}%` : '-'}
                  </td>
                  <td className="text-center p-2 border-b border-slate-700">0%</td>
                </tr>
                <tr>
                  <td className="p-2 border-b border-slate-700">Cross-over sign (figure of 8)</td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getBooleanStatus(measurements.crossoverSign.right))}`}>
                    {measurements.crossoverSign.right ? 'Ja' : 'Nein'}
                  </td>
                  <td className={`text-center p-2 border-b border-slate-700 ${getStatusColor(getBooleanStatus(measurements.crossoverSign.left))}`}>
                    {measurements.crossoverSign.left ? 'Ja' : 'Nein'}
                  </td>
                  <td className="text-center p-2 border-b border-slate-700">Nein</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HipMeasurementInterface;

