def test_detection_module_import():
    from modules.detection import detector
    assert hasattr(detector, "generate_frames")
