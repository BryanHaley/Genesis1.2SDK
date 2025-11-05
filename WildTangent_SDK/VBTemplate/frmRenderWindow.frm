VERSION 5.00
Object = "{FA13AA2E-CA9B-11D2-9780-00104B242EA3}#1.0#0"; "WT3D.DLL"
Begin VB.Form frmRenderWindow 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Render Window"
   ClientHeight    =   7200
   ClientLeft      =   45
   ClientTop       =   330
   ClientWidth     =   9600
   Icon            =   "frmRenderWindow.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   480
   ScaleMode       =   3  'Pixel
   ScaleWidth      =   640
   StartUpPosition =   3  'Windows Default
   Begin WT3DLibCtl.WT WTObject 
      Height          =   7200
      Left            =   0
      OleObjectBlob   =   "frmRenderWindow.frx":030A
      TabIndex        =   0
      Top             =   0
      Width           =   9600
   End
End
Attribute VB_Name = "frmRenderWindow"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

Dim wtObj As WT
Dim Stage As IWTStage
Dim Camera As IWTCamera
Dim AmbientLight As IWTLight
Dim backImage As IWTBitmap
Dim backDrop As IWTDrop
Dim boxModel As IWTModel
Dim boxContainer As IWTContainer

Private Sub Form_Load()
 On Error Resume Next

    'Assign the WTObject of the form to a local variable - makes it easier to work with
    Set wtObj = Me.WTObject

    'Make sure the user's machine can run the Web Driver
    If wtObj.getInitStatus(0) <> 0 Then
        MsgBox "DirectX 3 or higher not detected.  DirectX is required.", vbCritical, "Error"
        End
    End If
    
    If wtObj.getInitStatus(1) <> 0 Then
        MsgBox "8bit color detected.  16bit color or higher is required.", vbCritical, "Error"
        End
    End If

    'Create a stage
    Set Stage = wtObj.createStage
    
    'Create and position a camera
    Set Camera = Stage.createCamera
    Camera.setName "Main Camera"
    Camera.setPosition 0, 0, -2
    
    'Create a background image, and color it blue
    Set backImage = wtObj.createBlankBitmap(100, 100)
    backImage.setColor 0, 0, 64
    
    'Create a drop, and size it to the entire render area
    Set backDrop = Camera.addDrop(backImage)
    backDrop.setSize wtObj.getWidth, wtObj.getHeight
    
    'Create and add an ambient light
    Set AmbientLight = wtObj.createLight(tWTLightAmbient)
    AmbientLight.setColor 100, 100, 100
    Stage.addObject AmbientLight
    
    'Create a box
    Set boxModel = wtObj.createBox(1, 1, 1, 5)
    
    'Color each face of the box model
    boxModel.setColor 255, 0, 0, "top"
    boxModel.setColor 0, 255, 0, "bottom"
    boxModel.setColor 0, 0, 255, "left"
    boxModel.setColor 255, 0, 255, "right"
    boxModel.setColor 255, 255, 0, "front"
    boxModel.setColor 0, 255, 255, "back"

    'Create a container to hold the boxModel
    Set boxContainer = wtObj.createContainer
    
    'Attach the boxModel to the boxContainer
    boxContainer.attach boxModel
    
    'Add the boxContainer to the stage
    Stage.addObject boxContainer
    
    'Spin the box...
    boxContainer.setConstantRotation 1, 1, 1, 25

    'Turn on event reporting for the WTObject
    wtObj.setNotifyKeyboardEvent 1
    wtObj.setNotifyRenderEvent 1
    wtObj.setNotifyMouseEvent 2
    
    'Start the WTObject
    wtObj.start
End Sub

Private Sub WTObject_WTExceptionEvent(ByVal pWTEventObj As WT3DLibCtl.IWTEvent)
 On Error Resume Next
    'called when the WTObject encounters a problem
End Sub

Private Sub WTObject_WTKeyboardEvent(ByVal pWTEventObj As WT3DLibCtl.IWTEvent)
 On Error Resume Next
    'called when the WTObject receives a keyboard event
End Sub

Private Sub WTObject_WTMouseEvent(ByVal pWTEventObj As WT3DLibCtl.IWTEvent)
 On Error Resume Next
    'called when the WTObject receives a mouse event
End Sub

Private Sub WTObject_WTRenderEvent(ByVal pWTEventObj As WT3DLibCtl.IWTEvent)
 On Error Resume Next
    'called every render of the WTObject
End Sub
