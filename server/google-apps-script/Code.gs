// server/google-apps-script/Code.gs
// Paste this entire file into your Google Sheet Apps Script editor.
// Sheet name: WFM
// Sheet URL: https://docs.google.com/spreadsheets/d/1AO5cK9QpQP4hW5s-C53b1IcPkZoRGA_nDyigN_rDRr0/edit?usp=sharing
// Deploy as Web App:
// Execute as: Me
// Who has access: Anyone

const SPREADSHEET_ID = '1AO5cK9QpQP4hW5s-C53b1IcPkZoRGA_nDyigN_rDRr0';

const HEADERS = {
  Agents: [
    'Timestamp',
    'Action',
    'Employee ID',
    'Agent Name',
    'Vendor',
    'Supervisor',
    'Hourly Rate',
    'Status',
    'Hire Date'
  ],
  Daily_Time_Log: [
    'Timestamp',
    'Action',
    'Work Date',
    'Employee ID',
    'Agent Name',
    'Vendor',
    'Scheduled Start',
    'Scheduled End',
    'Actual Login',
    'Actual Logout',
    'Break 1 Start',
    'Break 1 End',
    'Lunch Start',
    'Lunch End',
    'Break 2 Start',
    'Break 2 End',
    'Meeting Minutes',
    'Training Minutes',
    'System Downtime Minutes',
    'After Call Work Minutes',
    'Calls Handled',
    'AHT Seconds',
    'QA Score',
    'FCR Score',
    'Cost Per Call',
    'Notes'
  ],
  Vendor_Monthly_Metrics: [
    'Timestamp',
    'Action',
    'Month',
    'Vendor',
    'Current Billed Agents',
    'Optimized Required Agents',
    'Avg Hourly Rate',
    'Monthly Billable Hours',
    'Monthly Call Volume',
    'AHT Seconds',
    'Target Service Level',
    'Occupancy Target',
    'Shrinkage %',
    'QA Score',
    'FCR Score',
    'Cost Per Call',
    'Monthly Waste',
    'Monthly Savings'
  ],
  Savings_Audit_Log: [
    'Timestamp',
    'Action',
    'Vendor',
    'Current Billed Agents',
    'Optimized Required Agents',
    'Agent Gap',
    'Avg Hourly Rate',
    'Monthly Billable Hours Per Agent',
    'Estimated Monthly Savings',
    'Estimated Annual Savings',
    'Created By',
    'Assumptions JSON'
  ]
};

const DEMO_VENDOR_ROWS = [
  ['2026-06-01T00:00:00.000Z', 'seed', '2026-06', 'Tep', 108, 91, 17.75, 17280, 42600, 455, 0.8, 0.85, 0.31, 88.4, 82.7, 3.72, 11005, 52156],
  ['2026-06-01T00:00:00.000Z', 'seed', '2026-06', 'Concentrix', 102, 88, 18.25, 16320, 44100, 455, 0.8, 0.85, 0.31, 91.1, 84.2, 3.55, 9855, 44688],
  ['2026-06-01T00:00:00.000Z', 'seed', '2026-06', 'Buwelo', 95, 82, 16.95, 15200, 39750, 455, 0.8, 0.85, 0.31, 89.7, 85.9, 3.28, 8306, 35256],
  ['2026-06-01T00:00:00.000Z', 'seed', '2026-06', 'Telus', 95, 79, 19.1, 15200, 38650, 455, 0.8, 0.85, 0.31, 92.4, 86.5, 3.94, 10983, 48900]
];

function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = params.action || 'dashboard';

    if (action === 'setup') {
      setupWorkbook_();
      return jsonResponse_({ ok: true, message: 'WFM workbook is ready.' });
    }

    setupWorkbook_();

    if (action === 'dashboard') {
      return jsonResponse_(buildDashboardResponse_());
    }

    if (action === 'vendors') {
      return jsonResponse_({ vendorSummary: readVendorSummary_() });
    }

    if (action === 'agents') {
      return jsonResponse_({ agents: readAgents_() });
    }

    return jsonResponse_({ ok: false, message: 'Unknown action. Use setup, dashboard, vendors, or agents.' });
  } catch (error) {
    return jsonResponse_({ ok: false, message: error.message });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || '{}');
    const action = body.action || 'saveSavingsAudit';

    setupWorkbook_();

    if (action === 'saveSavingsAudit') {
      const payload = body.payload || {};
      appendSavingsAudit_(payload);
      return jsonResponse_({ ok: true, saved: true, message: 'Savings audit saved.' });
    }

    return jsonResponse_({ ok: false, saved: false, message: 'Unknown POST action.' });
  } catch (error) {
    return jsonResponse_({ ok: false, saved: false, message: error.message });
  }
}

function setupWorkbook_() {
  Object.keys(HEADERS).forEach(function(tabName) {
    const sheet = getOrCreateSheet_(tabName);
    ensureHeaders_(sheet, HEADERS[tabName]);
  });

  seedVendorMetricsIfEmpty_();
  seedAgentsIfEmpty_();
  seedDailyLogsIfEmpty_();
}

function buildDashboardResponse_() {
  return {
    ok: true,
    source: 'google-sheet',
    generatedAt: new Date().toISOString(),
    vendorSummary: readVendorSummary_(),
    agents: readAgents_()
  };
}

function readVendorSummary_() {
  const rows = readObjects_('Vendor_Monthly_Metrics');

  return rows.map(function(row) {
    const hourlyRate = toNumber_(row['Avg Hourly Rate']);
    const monthlyWaste = toNumber_(row['Monthly Waste']);

    return {
      vendor: row['Vendor'],
      currentBilledAgents: toNumber_(row['Current Billed Agents']),
      optimizedRequiredAgents: toNumber_(row['Optimized Required Agents']),
      avgHourlyRate: hourlyRate,
      unproductiveShrinkageHours: hourlyRate ? Number((monthlyWaste / hourlyRate).toFixed(1)) : 0,
      costPerCall: toNumber_(row['Cost Per Call']),
      qaScore: toNumber_(row['QA Score']),
      fcrScore: toNumber_(row['FCR Score']),
      monthlyWaste,
      monthlySavings: toNumber_(row['Monthly Savings']),
      monthlyCallVolume: toNumber_(row['Monthly Call Volume']),
      ahtSeconds: toNumber_(row['AHT Seconds']),
      shrinkagePercent: toNumber_(row['Shrinkage %'])
    };
  });
}

function readAgents_() {
  const agentRows = readObjects_('Agents');
  const dailyRows = readObjects_('Daily_Time_Log');
  const dailyByEmployeeId = {};

  dailyRows.forEach(function(row) {
    dailyByEmployeeId[row['Employee ID']] = row;
  });

  return agentRows.map(function(agent) {
    const daily = dailyByEmployeeId[agent['Employee ID']] || {};
    const hourlyRate = toNumber_(agent['Hourly Rate']);
    const breakOverageHours = calculateBreakOverageHours_(daily);
    const meetingHours = toNumber_(daily['Meeting Minutes']) / 60;
    const trainingHours = toNumber_(daily['Training Minutes']) / 60;
    const downtimeHours = toNumber_(daily['System Downtime Minutes']) / 60;
    const unproductiveShrinkageHours = Number((breakOverageHours + meetingHours + trainingHours + downtimeHours).toFixed(2));

    return {
      employeeId: agent['Employee ID'],
      name: agent['Agent Name'],
      vendor: agent['Vendor'],
      supervisor: agent['Supervisor'],
      hourlyRate,
      status: agent['Status'],
      workDate: daily['Work Date'] || '',
      scheduledStart: daily['Scheduled Start'] || '',
      scheduledEnd: daily['Scheduled End'] || '',
      actualLogin: daily['Actual Login'] || '',
      actualLogout: daily['Actual Logout'] || '',
      callsHandled: toNumber_(daily['Calls Handled']),
      ahtSeconds: toNumber_(daily['AHT Seconds']),
      qaScore: toNumber_(daily['QA Score']),
      fcrScore: toNumber_(daily['FCR Score']),
      costPerCall: toNumber_(daily['Cost Per Call']),
      unproductiveShrinkageHours,
      costOfGeneralSlack: Number((hourlyRate * unproductiveShrinkageHours).toFixed(2))
    };
  });
}

function appendSavingsAudit_(payload) {
  const sheet = getOrCreateSheet_('Savings_Audit_Log');
  ensureHeaders_(sheet, HEADERS.Savings_Audit_Log);

  const currentBilledAgents = toNumber_(payload.currentBilledAgents);
  const optimizedRequiredAgents = toNumber_(payload.optimizedRequiredAgents);
  const agentGap = toNumber_(payload.agentGap || currentBilledAgents - optimizedRequiredAgents);
  const avgHourlyRate = toNumber_(payload.avgHourlyRate);
  const monthlyBillableHoursPerAgent = toNumber_(payload.monthlyBillableHoursPerAgent);
  const estimatedMonthlySavings = toNumber_(payload.estimatedMonthlySavings || agentGap * avgHourlyRate * monthlyBillableHoursPerAgent);
  const estimatedAnnualSavings = toNumber_(payload.estimatedAnnualSavings || estimatedMonthlySavings * 12);

  sheet.appendRow([
    new Date().toISOString(),
    'saveSavingsAudit',
    payload.vendor || '',
    currentBilledAgents,
    optimizedRequiredAgents,
    agentGap,
    avgHourlyRate,
    monthlyBillableHoursPerAgent,
    estimatedMonthlySavings,
    estimatedAnnualSavings,
    payload.createdBy || 'Dashboard Demo',
    JSON.stringify(payload)
  ]);

  autosize_(sheet);
}

function seedVendorMetricsIfEmpty_() {
  const sheet = getOrCreateSheet_('Vendor_Monthly_Metrics');
  ensureHeaders_(sheet, HEADERS.Vendor_Monthly_Metrics);

  if (sheet.getLastRow() > 1) return;

  sheet.getRange(2, 1, DEMO_VENDOR_ROWS.length, DEMO_VENDOR_ROWS[0].length).setValues(DEMO_VENDOR_ROWS);
  autosize_(sheet);
}

function seedAgentsIfEmpty_() {
  const sheet = getOrCreateSheet_('Agents');
  ensureHeaders_(sheet, HEADERS.Agents);

  if (sheet.getLastRow() > 1) return;

  const vendors = ['Tep', 'Concentrix', 'Buwelo', 'Telus'];
  const rates = { Tep: 17.75, Concentrix: 18.25, Buwelo: 16.95, Telus: 19.1 };
  const rows = [];

  for (let i = 0; i < 400; i += 1) {
    const vendor = vendors[i % vendors.length];
    rows.push([
      new Date().toISOString(),
      'seed',
      vendor.toUpperCase().slice(0, 3) + '-' + String(i + 1).padStart(4, '0'),
      'Agent ' + String(i + 1).padStart(3, '0'),
      vendor,
      'Supervisor ' + (1 + (i % 8)),
      Number((rates[vendor] + ((i % 7) - 3) * 0.15).toFixed(2)),
      'Active',
      Utilities.formatDate(new Date(2025, i % 12, 1 + (i % 25)), Session.getScriptTimeZone(), 'yyyy-MM-dd')
    ]);
  }

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  autosize_(sheet);
}

function seedDailyLogsIfEmpty_() {
  const sheet = getOrCreateSheet_('Daily_Time_Log');
  ensureHeaders_(sheet, HEADERS.Daily_Time_Log);

  if (sheet.getLastRow() > 1) return;

  const agentSheet = getOrCreateSheet_('Agents');
  const lastRow = agentSheet.getLastRow();
  if (lastRow < 2) return;

  const agentRows = agentSheet.getRange(2, 1, lastRow - 1, HEADERS.Agents.length).getValues();
  const rows = [];
  const today = new Date();

  agentRows.forEach(function(agent, index) {
    const employeeId = agent[2];
    const agentName = agent[3];
    const vendor = agent[4];
    const workDate = new Date(today);
    workDate.setDate(today.getDate() - (index % 7));

    const startHour = 7 + (index % 4);
    const break1Overage = index % 5;
    const break2Overage = index % 4;
    const meetingMinutes = (index % 5) * 8;
    const downtimeMinutes = (index % 6) * 7;
    const callsHandled = 38 + (index % 25);
    const ahtSeconds = 420 + (index % 15) * 12;
    const qaScore = 84 + (index % 12);
    const fcrScore = 78 + (index % 14);
    const costPerCall = Number((3.15 + (index % 10) * 0.08).toFixed(2));

    rows.push([
      new Date().toISOString(),
      'seed',
      Utilities.formatDate(workDate, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
      employeeId,
      agentName,
      vendor,
      timeString_(startHour, 0),
      timeString_(startHour + 8, 30),
      timeString_(startHour, index % 9),
      timeString_(startHour + 8, 24 + (index % 8)),
      timeString_(startHour + 2, 0),
      timeString_(startHour + 2, 15 + break1Overage),
      timeString_(startHour + 4, 0),
      timeString_(startHour + 4, 30),
      timeString_(startHour + 6, 0),
      timeString_(startHour + 6, 15 + break2Overage),
      meetingMinutes,
      (index % 3) * 6,
      downtimeMinutes,
      24 + (index % 12),
      callsHandled,
      ahtSeconds,
      qaScore,
      fcrScore,
      costPerCall,
      index % 19 === 0 ? 'Review schedule adherence and unproductive shrinkage.' : ''
    ]);
  });

  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  autosize_(sheet);
}

function calculateBreakOverageHours_(daily) {
  const allowedBreakMinutes = 30;
  const break1Minutes = minutesBetween_(daily['Break 1 Start'], daily['Break 1 End']);
  const break2Minutes = minutesBetween_(daily['Break 2 Start'], daily['Break 2 End']);
  const totalBreakMinutes = break1Minutes + break2Minutes;
  const overageMinutes = Math.max(totalBreakMinutes - allowedBreakMinutes, 0);
  return overageMinutes / 60;
}

function readObjects_(tabName) {
  const sheet = getOrCreateSheet_(tabName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0];
  return values.slice(1).filter(function(row) {
    return row.some(function(cell) { return cell !== ''; });
  }).map(function(row) {
    const item = {};
    headers.forEach(function(header, index) {
      item[header] = row[index];
    });
    return item;
  });
}

function getOrCreateSheet_(name) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function ensureHeaders_(sheet, headers) {
  if (!headers || headers.length === 0) return;

  const currentHeaders = sheet.getLastColumn() > 0
    ? sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0]
    : [];

  const needsHeaders = currentHeaders.slice(0, headers.length).join('|') !== headers.join('|');

  if (needsHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function toNumber_(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function minutesBetween_(start, end) {
  if (!start || !end) return 0;
  const startParts = String(start).split(':').map(Number);
  const endParts = String(end).split(':').map(Number);

  if (startParts.length < 2 || endParts.length < 2) return 0;

  const startMinutes = startParts[0] * 60 + startParts[1];
  const endMinutes = endParts[0] * 60 + endParts[1];
  return Math.max(endMinutes - startMinutes, 0);
}

function timeString_(hour, minute) {
  const normalizedHour = ((hour % 24) + 24) % 24;
  const normalizedMinute = ((minute % 60) + 60) % 60;
  return String(normalizedHour).padStart(2, '0') + ':' + String(normalizedMinute).padStart(2, '0');
}

function autosize_(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn > 0) {
    sheet.autoResizeColumns(1, lastColumn);
  }
}
