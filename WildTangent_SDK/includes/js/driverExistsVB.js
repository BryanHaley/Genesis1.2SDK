function ieDetectDriver
  on error resume next
	Dim wtObject
	Set wtObject = CreateObject("WT3D.WT")
	if err.number <> 0 then
		Set wtObject = Nothing
		ieDetectDriver = false
	else
		Set wtObject = Nothing
		ieDetectDriver = true
	end if
end function
