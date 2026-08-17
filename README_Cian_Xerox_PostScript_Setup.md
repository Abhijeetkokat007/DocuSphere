# Cian Healthcare -- Xerox PostScript Printer Setup

## Purpose

This document is for setting up the PostScript printer required by the
Cian Healthcare Purchase Module for PDF report generation on Windows 11.

The error this setup fixes is:

> Postscript Printer is not set up properly, can not create the PDF
> report.

------------------------------------------------------------------------

## 1. Required Configuration

-   Operating System: Windows 11 64-bit
-   Printer Driver: **Xerox Global Print Driver PS**
-   Driver Type: **x64, Type 3 -- User Mode**
-   Printer Name: **Xerox Global Print Driver PS**
-   Cian Setup Module → Server Post Script Printer Name: **Xerox Global
    Print Driver PS**

IMPORTANT: Select the **PS** driver. Do not select PCL, PCL6, Microsoft
Print to PDF, or another non-PostScript driver.

------------------------------------------------------------------------

## 2. Open Print Server Properties

Press:

**Win + R**

Enter:

``` text
printui.exe /s /t2
```

Press **Enter**.

This opens **Print Server Properties**.

Go to the **Drivers** tab.

------------------------------------------------------------------------

## 3. Install Xerox PostScript Driver

1.  Click **Add...**
2.  The **Add Printer Driver Wizard** opens.
3.  Select **x64** processor.
4.  Click **Next**.
5.  Manufacturer: **Xerox**
6.  Select:

``` text
Xerox Global Print Driver PS
```

7.  Click **Next**.
8.  Finish the Add Printer Driver Wizard.

If Windows asks:

**Which version of the driver do you want to use?**

Select:

**Use the driver that is currently installed (recommended)**

Then click **Next**.

------------------------------------------------------------------------

## 4. Verify the Driver

Open **PowerShell as Administrator**.

Run:

``` powershell
Get-PrinterDriver | Where-Object {$_.Name -like "*Xerox*"} | Format-Table Name,Manufacturer,MajorVersion,DriverVersion
```

Expected result should contain:

``` text
Xerox Global Print Driver PS
```

You can also verify from:

**Print Server Properties → Drivers**

The driver should be listed as:

``` text
Xerox Global Print Driver PS
```

------------------------------------------------------------------------

## 5. Create the Printer Queue

Installing the driver alone is not enough. A printer queue must also be
created.

1.  Press **Win + R**
2.  Enter:

``` text
control printers
```

3.  Click **Add printer**.
4.  Select **Add manually** if required.
5.  Select:

**Add a local printer or network printer with manual settings**

6.  Select the appropriate port.

For the tested setup, the port used was:

``` text
FILE: (Print to File)
```

7.  Select the installed driver:

``` text
Xerox Global Print Driver PS
```

8.  Set the printer name exactly to:

``` text
Xerox Global Print Driver PS
```

9.  Finish the printer installation.

------------------------------------------------------------------------

## 6. Verify the Printer Queue

Open Administrator PowerShell and run:

``` powershell
Get-Printer | Where-Object {$_.Name -like "*Xerox*"} | Format-Table Name,DriverName,PortName -AutoSize
```

Expected result should be similar to:

``` text
Name                         DriverName                    PortName
----                         ----------                    --------
Xerox Global Print Driver PS Xerox Global Print Driver PS FILE:
```

------------------------------------------------------------------------

## 7. Configure Cian Healthcare

Open:

**Setup Module → Server Post Script Printer Preference**

Click **Modify** if required.

Set:

``` text
Server Post Script Printer Name
Xerox Global Print Driver PS
```

The name must match the Windows printer name exactly.

Click:

**Save → Exit**

Then restart the Cian application.

------------------------------------------------------------------------

## 8. Test PDF Generation

1.  Open **Purchase Module**.
2.  Open **Report Layout Printing**.
3.  Select the required report.
4.  Select:

``` text
PDF File (PDF)
```

5.  Click **Preview** or **Create File**.
6.  Confirm that the PDF is generated successfully.

------------------------------------------------------------------------

## 9. Troubleshooting

### Error still says:

``` text
Postscript Printer is not set up properly, can not create the PDF report.
```

Check all of the following:

-   The Windows printer exists.
-   The printer name is exactly:

``` text
Xerox Global Print Driver PS
```

-   The printer uses:

``` text
Xerox Global Print Driver PS
```

-   The Cian Setup Module contains exactly the same printer name.
-   Cian was restarted after changing the printer configuration.
-   The driver is PS, not PCL/PCL6.
-   The printer is not deleted or offline.

Verify the driver:

``` powershell
Get-PrinterDriver | Where-Object {$_.Name -like "*Xerox*"}
```

Verify the printer:

``` powershell
Get-Printer | Where-Object {$_.Name -like "*Xerox*"} | Format-Table Name,DriverName,PortName -AutoSize
```

------------------------------------------------------------------------

## 10. Quick Checklist for the Next Laptop

-   [ ] Windows 11 64-bit confirmed
-   [ ] Run `printui.exe /s /t2`
-   [ ] Open Drivers tab
-   [ ] Click Add
-   [ ] Select x64
-   [ ] Select Xerox
-   [ ] Select **Xerox Global Print Driver PS**
-   [ ] Finish driver installation
-   [ ] Run PowerShell driver verification
-   [ ] Create printer queue
-   [ ] Printer name = **Xerox Global Print Driver PS**
-   [ ] Driver name = **Xerox Global Print Driver PS**
-   [ ] Configure Cian Setup Module
-   [ ] Server Post Script Printer Name = **Xerox Global Print Driver
    PS**
-   [ ] Save and restart Cian
-   [ ] Test PDF Preview/Create File

------------------------------------------------------------------------

## 11. Important

Do not select these for this Cian PostScript configuration:

``` text
Xerox Global Print Driver PCL
Xerox Global Print Driver PCL6
Microsoft Print to PDF
HP Universal Printing PCL 6
```

Use:

``` text
Xerox Global Print Driver PS
```

This is the PostScript driver required by the configuration observed in
the Cian Healthcare Setup Module.
